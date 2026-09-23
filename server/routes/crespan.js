import { Router } from 'express'
import { config, missingEnv } from '../config.js'
import { complete, parseJsonLoose, stream } from '../qwen.js'
import { CATEGORIES, CATEGORY_KEYS, searchNearZip } from '../attom.js'
import { clearAttempts, gateStatus, lock, rateLimited, requireAccess, unlock } from '../gate.js'

const router = Router()

const MAX_MESSAGES = 16
const MAX_CHARS = 2000
const DEFAULT_RADIUS = 10
const DEFAULT_LIMIT = 10

/**
 * CRESpan：用自然语言查邮编周边的商业地产。
 *
 * 一轮对话分两段走，不用 function calling：
 *   1) 让模型把这句话压成结构化意图（业态 / 邮编 / 半径 / 数量），非流式，拿全了再继续；
 *   2) 命中检索就去查 ATTOM，先把结果推给前端渲染卡片，再让模型就着结果写一段话。
 * 这样卡片一定出得来——不依赖模型是否规规矩矩地发起工具调用。
 */

const INTENT_PROMPT = `你是 CRESpan 的意图解析器。CRESpan 只能做一件事：查询某个美国 5 位邮编周边指定英里范围内的商业地产。
支持的业态只有三种：
- warehouse（仓库 / warehouse / 工业仓储）
- restaurant（餐馆 / 餐厅 / restaurant / 餐饮物业）
- commercial（商业地产 / 商铺 / 写字楼 / 办公 / 零售 / commercial / retail / office）

读完整段对话（含之前轮次），只输出一个 JSON 对象，不要任何解释：
{
  "action": "search" | "chat",
  "zip": "5 位邮编字符串，没有则 null",
  "category": "warehouse" | "restaurant" | "commercial" | null,
  "radius": 数字，单位英里，用户没说就 ${DEFAULT_RADIUS},
  "limit": 数字，用户没说就 ${DEFAULT_LIMIT},
  "language": "zh" | "en"
}

规则：
- 只有同时拿到 zip 和 category 才填 action="search"，否则 action="chat"。
- 用户这轮没说邮编但上文说过，沿用上文那个邮编；业态同理。
- language 取用户最后一句话所用的语言。
- 数量上限 50，半径上限 20；超出就截到上限。`

const REPLY_SYSTEM = `你是 CRESpan，一个商业地产检索助手，数据来自 ATTOM Property API。
能力边界：只能按「美国 5 位邮编 + 半径（英里）+ 业态（仓库 / 餐馆 / 商业地产）」检索房产。
说话规则：
- 用用户最后一句话的语言回答。
- 简短、具体，不用营销腔，不承诺投资回报、估值或租金。
- 缺邮编或业态时，直接问缺的那一项，并给一句示例，例如「90210 附近 10 英里内的 10 家仓库」。
- 被问到能力之外的事（贷款、估值、经纪服务），说明做不了，并把话题带回可以查的内容。`

/** 模型只吐结构化数据，页面上的卡片才是主角；这段话只做补充说明 */
const summarySystem = (lang) => `你是 CRESpan，一个商业地产检索助手。检索结果已经以卡片形式展示在页面上，不要逐条复述。
用${lang === 'en' ? '英文' : '中文'}写一段 80 字以内的说明：命中数量、最近与最远距离、业态构成或年代/面积上的明显特征，最后给一句可继续追问的建议。
不要编造数据里没有的字段，不谈估值、租金和投资建议。`

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

/** 解析意图。response_format 个别模型不支持，失败就退回普通补全再抠 JSON */
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
  const parsed = parseJsonLoose(text) ?? {}

  const zip = /^\d{5}$/.test(String(parsed.zip ?? '').trim()) ? String(parsed.zip).trim() : null
  const category = CATEGORY_KEYS.includes(parsed.category) ? parsed.category : null
  const radius = Math.min(Math.max(Number(parsed.radius) || DEFAULT_RADIUS, 0.5), 20)
  const limit = Math.min(Math.max(Number(parsed.limit) || DEFAULT_LIMIT, 1), 50)
  const language = parsed.language === 'en' ? 'en' : 'zh'
  return { search: Boolean(zip && category), zip, category, radius, limit, language }
}

/**
 * 页面启动时问一次：Demo 开着吗？要访问码吗？我这张 cookie 还作数吗？
 * 门禁没过就不回配置信息，避免对外暴露内部状态。
 */
router.get('/meta', (req, res) => {
  const gate = gateStatus(req)
  if (!gate.enabled || !gate.unlocked) return res.json({ ok: true, gate })

  const missing = missingEnv()
  res.json({
    ok: true,
    gate,
    model: { configured: missing.length === 0, missing },
    attom: { configured: Boolean(config.attom.apiKey) },
    defaults: { radius: DEFAULT_RADIUS, limit: DEFAULT_LIMIT },
    categories: CATEGORY_KEYS.map((key) => ({ key, label: CATEGORIES[key].label, types: CATEGORIES[key].types })),
  })
})

/** 输入访问码换通行 cookie */
router.post('/unlock', (req, res) => {
  const gate = gateStatus(req)
  if (!gate.enabled) {
    return res.status(503).json({ ok: false, error: 'disabled', message: 'Demo 暂未开放。' })
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'too_many', message: '尝试次数过多，请十分钟后再试。' })
  }

  if (!unlock(req, res, req.body?.code)) {
    return res.status(401).json({ ok: false, error: 'bad_code', message: '访问码不对。' })
  }
  clearAttempts(ip)
  res.json({ ok: true, gate: { enabled: true, required: gate.required, unlocked: true } })
})

/** 交还通行证：演示完在别人电脑上点一下，就回到要码的状态 */
router.post('/lock', (req, res) => {
  lock(req, res)
  res.json({ ok: true })
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
  // 超时按阶段计，不是整轮计：ATTOM 检索本身就可能跑掉几十秒，
  // 用一个总计时器会把后面的写作阶段一并掐死。
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
    'X-Accel-Buffering': 'no', // 关掉 Nginx 缓冲，否则流式会被攒成一坨
  })
  res.flushHeaders?.()
  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`)

  try {
    send({ type: 'status', stage: 'intent' })
    startClock()
    const intent = await readIntent(messages, controller.signal)
    stopClock()

    let convo = [{ role: 'system', content: REPLY_SYSTEM }, ...messages]

    if (intent.search) {
      send({ type: 'status', stage: 'search', query: { zip: intent.zip, category: intent.category, radius: intent.radius, limit: intent.limit } })

      let result
      try {
        result = await searchNearZip(intent)
      } catch (err) {
        console.error('[crespan] ATTOM 查询失败:', err.message)
        send({ type: 'error', message: `房产数据查询失败：${err.message}` })
        return
      }

      send({ type: 'results', payload: result })

      // 只把要点交给模型，整份报文太长且没有必要
      const brief = result.items.map((p, i) => ({
        n: i + 1,
        addr: p.oneLine ?? `${p.zip ?? ''} (地址未公开)`,
        mi: p.distance,
        type: p.propType,
        sqft: p.buildingSize,
        year: p.yearBuilt,
      }))
      convo = [
        { role: 'system', content: summarySystem(intent.language) },
        ...messages,
        {
          role: 'user',
          content: `检索完成。邮编 ${intent.zip}（${result.origin.city ?? ''} ${result.origin.state ?? ''}）半径 ${result.radius} 英里内的${CATEGORIES[intent.category].label.zh}，按距离由近到远取前 ${result.items.length} 条（实际扫描半径 ${result.searchedRadius} 英里${result.total ? `，匹配总数约 ${result.total}` : ''}）：\n${JSON.stringify(brief)}`,
        },
      ]
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
    console.error('[crespan] 处理失败:', err.message)
    send({ type: 'error', message: isTimeout ? '响应超时，请重试。' : err.message || '服务异常，请重试。' })
  } finally {
    stopClock()
    res.end()
  }
})

export default router
