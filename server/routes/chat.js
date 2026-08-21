import { Router } from 'express'
import { config, missingEnv } from '../config.js'
import { SYSTEM_PROMPT } from '../prompt.js'

const router = Router()

const MAX_MESSAGES = 40 // 只把最近若干轮送给模型，控制 token 与延迟
const MAX_CHARS = 4000 // 单条消息长度上限

/** 校验并规整前端传来的对话历史 */
function normalizeMessages(raw) {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { error: 'messages 必须是非空数组' }
  }
  const cleaned = []
  for (const m of raw) {
    if (!m || typeof m.content !== 'string') continue
    if (m.role !== 'user' && m.role !== 'assistant') continue
    const content = m.content.trim()
    if (!content) continue
    cleaned.push({ role: m.role, content: content.slice(0, MAX_CHARS) })
  }
  if (!cleaned.length) return { error: '没有可用的消息内容' }
  return { messages: cleaned.slice(-MAX_MESSAGES) }
}

router.post('/', async (req, res) => {
  const missing = missingEnv()
  if (missing.length) {
    // 503 表示「未配置」，与「服务出错」区分开，前端据此显示引导而非报错
    return res.status(503).json({
      error: 'not_configured',
      missing,
      message: `尚未配置：${missing.join('、')}。请在 .env 中填写后重启 API 服务。`,
    })
  }

  const { messages, error } = normalizeMessages(req.body?.messages)
  if (error) {
    return res.status(400).json({ error: 'bad_request', message: error })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort('timeout'), config.qwen.timeoutMs)
  // 客户端断开时同步中止上游请求，避免空转计费
  res.on('close', () => controller.abort('client_closed'))

  let upstream
  try {
    upstream = await fetch(`${config.qwen.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.qwen.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.qwen.model,
        stream: true,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      }),
      signal: controller.signal,
    })
  } catch (e) {
    clearTimeout(timeout)
    if (controller.signal.aborted && controller.signal.reason === 'client_closed') return
    const isTimeout = controller.signal.reason === 'timeout'
    console.error('[chat] 上游请求失败:', e.message)
    return res.status(504).json({
      error: isTimeout ? 'upstream_timeout' : 'upstream_unreachable',
      message: isTimeout ? '模型响应超时，请重试。' : `无法连接模型服务：${e.message}`,
    })
  }

  if (!upstream.ok) {
    clearTimeout(timeout)
    const detail = await upstream.text().catch(() => '')
    console.error(`[chat] 上游返回 ${upstream.status}:`, detail.slice(0, 300))
    return res.status(upstream.status).json({
      error: 'upstream_error',
      status: upstream.status,
      message: detail.slice(0, 500) || `模型服务返回 ${upstream.status}`,
    })
  }

  res.status(200).set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no', // 关掉 Nginx 缓冲，否则流式会被攒成一坨
  })
  res.flushHeaders?.()

  /**
   * 不做原样透传，而是归一化成自己的协议：
   *   { type: 'thinking' }              推理模型正在思考
   *   { type: 'delta', text: '...' }    正文增量
   *   { type: 'done' }
   *   { type: 'error', message: '...' }
   *
   * 两个理由：
   * 1. 推理模型（如 qwen3-max）的 reasoning_content 是思维链，会复述系统提示词。
   *    只在服务端消费，绝不发给浏览器。
   * 2. 前端不再绑定 Qwen 的报文格式，将来换模型只改这里。
   */
  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`)

  const decoder = new TextDecoder()
  let buffer = ''
  let sentThinking = false
  let gotContent = false

  try {
    for await (const chunk of upstream.body) {
      buffer += decoder.decode(chunk, { stream: true })

      const events = buffer.split('\n\n')
      buffer = events.pop() ?? '' // 末尾可能是半条，留到下一轮

      for (const evt of events) {
        const line = evt.split('\n').find((l) => l.startsWith('data:'))
        if (!line) continue
        const payload = line.slice(5).trim()
        if (!payload || payload === '[DONE]') continue

        let json
        try {
          json = JSON.parse(payload)
        } catch {
          continue // 跳过解析不了的片段，不中断整条流
        }

        const delta = json.choices?.[0]?.delta
        if (!delta) continue

        if (delta.content) {
          gotContent = true
          send({ type: 'delta', text: delta.content })
        } else if (delta.reasoning_content && !sentThinking) {
          sentThinking = true
          send({ type: 'thinking' }) // 只发一次，用于前端切到「正在思考」
        }
      }
    }

    if (!gotContent) {
      send({ type: 'error', message: '模型没有返回正文内容。' })
    } else {
      send({ type: 'done' })
    }
  } catch (e) {
    if (!controller.signal.aborted) {
      console.error('[chat] 流中断:', e.message)
      send({ type: 'error', message: '连接中断，请重试。' })
    }
  } finally {
    clearTimeout(timeout)
    res.end()
  }
})

export default router
