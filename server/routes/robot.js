import { Router } from 'express'
import { config, missingEnv } from '../config.js'
import { complete, parseJsonLoose, stream } from '../qwen.js'
import { CATEGORIES, CATEGORY_KEYS, searchNearZip } from '../attom.js'
import { lookupAddress, listByZip } from '../robot.js'
import { gateStatus, requireAccess } from '../gate.js'

const router = Router()

const MAX_MESSAGES = 16
const MAX_CHARS = 2000
const DEFAULT_LIMIT = 10
const ASPECTS = ['profile', 'value', 'sales']

/**
 * Robot：像聊天一样问房产。
 *
 * 和 CRESpan 同一套两段式：先让模型把这句话压成结构化意图，再按意图查 ATTOM，
 * 结果先推给前端渲染卡片，最后让模型就着结果写一段话。三种查询：
 *   lookup  按地址查一套房产：档案，按需加估值（AVM）与成交记录
 *   zip     按邮编列房产
 *   nearby  邮编周边某业态（仓库 / 餐馆 / 商业地产），复用 CRESpan 的检索
 * 门禁与 CRESpan 共用：同一个访问码、同一枚 cookie。
 */

const INTENT_PROMPT = `你是房产问答机器人的意图解析器。数据来自 ATTOM，只覆盖美国房产。
可做的查询：
- lookup：按具体地址查一套房产。aspects 从 profile（档案：面积、房间、地块、税、业主、上次成交）、value（估值 AVM）、sales（历史成交）里选。
- zip：列出某个 5 位邮编里的房产。
- nearby：某邮编周边指定英里内的某类商业地产，category 只能是 warehouse（仓库）、restaurant（餐馆）、commercial（商铺/写字楼/零售）。

读完整段对话（含之前轮次），只输出一个 JSON 对象，不要任何解释：
{
  "action": "lookup" | "zip" | "nearby" | "chat",
  "address1": "门牌号+街道，例如 4529 Winona Court；没有则 null",
  "address2": "城市, 州缩写 或 5 位邮编，例如 Denver, CO；没有则 null",
  "aspects": ["profile", "value", "sales"] 的子集,
  "zip": "5 位邮编字符串，没有则 null",
  "category": "warehouse" | "restaurant" | "commercial" | null,
  "radius": 数字，英里，没说就 10,
  "limit": 数字，没说就 ${DEFAULT_LIMIT},
  "language": "zh" | "en"
}

规则：
- lookup 需要 address1 和 address2 都有；用户给的是一整行地址就自己拆开。
- aspects：问价值/值多少/估价 → 含 value；问成交/买卖记录/历史价格 → 含 sales；泛泛地问「这套房子怎么样 / 查一下」→ ["profile","value"]。profile 总是包含。
- 用户接着上一套房追问（「它的成交记录呢」），沿用上文的地址。
- nearby 需要 zip 和 category；只有 zip 没有业态 → zip。
- 信息不够就 action="chat"。
- language 取用户最后一句话所用的语言。limit 上限 50，radius 上限 20。`

const REPLY_SYSTEM = `你是一个美国房产问答机器人，数据来自 ATTOM Property API。
能力边界：按地址查单套房产的档案、估值和成交记录；按邮编列房产；查邮编周边的仓库、餐馆、商业地产。
说话规则：
- 用用户最后一句话的语言回答，简短、具体。
- 缺信息时直接问缺的那一项，并给一句示例，例如「4529 Winona Court, Denver, CO 值多少钱？」。
- 能力之外的事（贷款、经纪、投资建议）说明做不了，把话题带回可以查的内容。`

const summarySystem = (lang) => `你是一个美国房产问答机器人。查询结果已经以卡片形式展示在页面左侧，不要逐项复述。
用${lang === 'en' ? '英文' : '中文'}写一段 100 字以内的说明：挑最值得注意的两三点（比如估值与上次成交价的差、房龄、税额、成交频率），最后给一句可继续追问的建议。
只用数据里有的数字，不编造，不提供投资建议；估值要说明是模型估算。`

function normalizeMessages(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return { error: 'messages 必须是非空数组' }
  const cleaned = []
  for (const m of raw) {
    if (!m || typeof m.content !== 'string') continue
    if (m.role !== 'user' && m.role !== 'assistant') continue
    const content = m.content.trim()
    if (content) cleaned.push({ role: m.role, content: content.slice(0, MAX_CHARS) })
  }
  if (!cleaned.length) return { error: '没有可用的消息内容' }
  return { messages: cleaned.slice(-MAX_MESSAGES) }
}

const str = (v) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, 200) : null)

async function readIntent(messages, signal) {
  const payload = [
    { role: 'system', content: INTENT_PROMPT },
    ...messages,
    { role: 'user', content: '（请只输出 JSON）' },
  ]
  let text = ''
  try {
    text = await complete({ messages: payload, signal, json: true })
  } catch {
    text = await complete({ messages: payload, signal, json: false })
  }
  const p = parseJsonLoose(text) ?? {}

  const address1 = str(p.address1)
  const address2 = str(p.address2)
  const zip = /^\d{5}$/.test(String(p.zip ?? '').trim()) ? String(p.zip).trim() : null
  const category = CATEGORY_KEYS.includes(p.category) ? p.category : null
  const aspects = [
    'profile',
    ...(Array.isArray(p.aspects) ? p.aspects : []).filter((a) => ASPECTS.includes(a) && a !== 'profile'),
  ]
  const intent = {
    action: 'chat',
    address1,
    address2,
    aspects,
    zip,
    category,
    radius: Math.min(Math.max(Number(p.radius) || 10, 0.5), 20),
    limit: Math.min(Math.max(Number(p.limit) || DEFAULT_LIMIT, 1), 50),
    language: p.language === 'en' ? 'en' : 'zh',
  }
  // 模型给的 action 只作参考，条件不满足就退回聊天，免得拿半截参数去查
  if (p.action === 'lookup' && address1 && address2) intent.action = 'lookup'
  else if (p.action === 'nearby' && zip && category) intent.action = 'nearby'
  else if ((p.action === 'zip' || p.action === 'nearby') && zip) intent.action = 'zip'
  return intent
}

/** 只把要点交给模型写说明：整份报文太长，业主姓名也没必要进模型 */
function briefOf(result) {
  if (result.kind === 'lookup') {
    const { profile, value, sales } = result
    return {
      address: profile.oneLine,
      type: profile.propType,
      yearBuilt: profile.yearBuilt,
      building: profile.building,
      lot: profile.lot,
      assessment: profile.assessment,
      lastSale: profile.lastSale,
      occupancy: profile.occupancy,
      avm: value,
      salesHistory: sales,
      unavailable: result.missing,
    }
  }
  return {
    area: result.zip ?? result.origin?.zip,
    total: result.total,
    items: result.items.map((p) => ({
      addr: p.oneLine,
      type: p.propType,
      sqft: p.buildingSize,
      year: p.yearBuilt,
      mi: p.distance,
    })),
  }
}

router.get('/meta', (req, res) => {
  const gate = gateStatus(req)
  if (!gate.enabled || !gate.unlocked) return res.json({ ok: true, gate })
  const missing = missingEnv()
  res.json({
    ok: true,
    gate,
    model: { configured: missing.length === 0, missing },
    attom: { configured: Boolean(config.attom.apiKey) },
  })
})

router.post('/chat', requireAccess, async (req, res) => {
  const missing = missingEnv()
  if (missing.length || !config.attom.apiKey) {
    const all = [...missing, ...(config.attom.apiKey ? [] : ['ATTOM_API_KEY'])]
    return res.status(503).json({
      error: 'not_configured',
      missing: all,
      message: `尚未配置：${all.join('、')}。请在 .env 中填写后重启 API 服务。`,
    })
  }

  const { messages, error } = normalizeMessages(req.body?.messages)
  if (error) return res.status(400).json({ error: 'bad_request', message: error })

  const controller = new AbortController()
  // 按阶段计时：ATTOM 查询本身可能要几十秒，不能让它吃掉写作阶段的时间
  let timeout = null
  const startClock = () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => controller.abort('timeout'), config.qwen.timeoutMs)
  }
  const stopClock = () => clearTimeout(timeout)
  res.on('close', () => controller.abort('client_closed'))

  res.status(200).set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  })
  res.flushHeaders?.()
  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`)

  try {
    send({ type: 'status', stage: 'intent' })
    startClock()
    const intent = await readIntent(messages, controller.signal)
    stopClock()

    let convo = [{ role: 'system', content: REPLY_SYSTEM }, ...messages]

    if (intent.action !== 'chat') {
      send({ type: 'status', stage: 'search' })

      let result
      try {
        if (intent.action === 'lookup') {
          result = await lookupAddress(intent)
        } else if (intent.action === 'nearby') {
          result = { kind: 'list', ...(await searchNearZip(intent)) }
        } else {
          result = await listByZip(intent)
        }
      } catch (err) {
        console.error('[robot] ATTOM 查询失败:', err.message)
        // 查无此址不算故障，交给模型用自然语言请用户核对
        if (!err.notFound) {
          send({ type: 'error', message: `房产数据查询失败：${err.message}` })
          return
        }
        convo.push({ role: 'user', content: `（系统提示：${err.message}。请用一两句话请用户核对地址。）` })
      }

      if (result) {
        send({ type: 'results', payload: result })
        const label =
          intent.action === 'nearby' ? `邮编 ${intent.zip} 周边 ${intent.radius} 英里内的${CATEGORIES[intent.category].label.zh}` : ''
        convo = [
          { role: 'system', content: summarySystem(intent.language) },
          ...messages,
          { role: 'user', content: `查询完成${label ? `（${label}）` : ''}，数据如下：\n${JSON.stringify(briefOf(result))}` },
        ]
      }
    }

    send({ type: 'status', stage: 'writing' })
    startClock()

    let got = false
    for await (const evt of stream({ messages: convo, signal: controller.signal })) {
      if (evt.type === 'delta') got = true
      send(evt)
    }
    send(got ? { type: 'done' } : { type: 'error', message: '模型没有返回正文内容。' })
  } catch (err) {
    if (controller.signal.aborted && controller.signal.reason === 'client_closed') return
    const isTimeout = controller.signal.reason === 'timeout'
    console.error('[robot] 处理失败:', err.message)
    send({ type: 'error', message: isTimeout ? '响应超时，请重试。' : err.message || '服务异常，请重试。' })
  } finally {
    stopClock()
    res.end()
  }
})

export default router
