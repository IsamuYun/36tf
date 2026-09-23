import { config } from './config.js'

/**
 * Qwen（DashScope OpenAI 兼容端点）的两种调用方式。
 * /api/chat 的流式逻辑早于本文件存在，保持原样不动；
 * CRESpan 需要「先出结构化意图，再出自然语言」两段式，所以单独抽这一层。
 */

const ENDPOINT = () => `${config.qwen.baseUrl}/chat/completions`

function authHeaders() {
  return {
    Authorization: `Bearer ${config.qwen.apiKey}`,
    'Content-Type': 'application/json',
  }
}

/**
 * 一次性补全，返回纯文本。用于意图解析这类要拿到完整结果才能继续的步骤。
 * @param {{ messages: object[], signal?: AbortSignal, json?: boolean, temperature?: number, maxTokens?: number }} opts
 */
export async function complete({ messages, signal, json = false, temperature = 0, maxTokens = 400 }) {
  const resp = await fetch(ENDPOINT(), {
    method: 'POST',
    headers: authHeaders(),
    signal,
    body: JSON.stringify({
      model: config.qwen.model,
      messages,
      temperature,
      max_tokens: maxTokens,
      // 让模型只吐 JSON。个别模型不支持该参数，失败时下面会退回普通补全。
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  })

  if (!resp.ok) {
    const detail = await resp.text().catch(() => '')
    const err = new Error(detail.slice(0, 300) || `模型服务返回 ${resp.status}`)
    err.status = resp.status
    throw err
  }

  const body = await resp.json()
  return body.choices?.[0]?.message?.content ?? ''
}

/**
 * 从模型输出里取出第一个 JSON 对象。
 * 开了 response_format 通常直接就是 JSON，但模型偶尔会套 ```json 代码块，
 * 或在前后加一句话，这里一并容错。
 */
export function parseJsonLoose(text) {
  const raw = String(text ?? '').trim()
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced ? fenced[1] : raw
  try {
    return JSON.parse(candidate)
  } catch {
    const start = candidate.indexOf('{')
    const end = candidate.lastIndexOf('}')
    if (start === -1 || end <= start) return null
    try {
      return JSON.parse(candidate.slice(start, end + 1))
    } catch {
      return null
    }
  }
}

/**
 * 流式补全。逐个吐出归一化事件：
 *   { type: 'thinking' }           推理模型正在思考（只发一次）
 *   { type: 'delta', text }        正文增量
 * 推理模型的 reasoning_content 会复述系统提示词，只在服务端消费，绝不外发。
 */
export async function* stream({ messages, signal, temperature = 0.4 }) {
  const resp = await fetch(ENDPOINT(), {
    method: 'POST',
    headers: authHeaders(),
    signal,
    body: JSON.stringify({
      model: config.qwen.model,
      messages,
      temperature,
      stream: true,
    }),
  })

  if (!resp.ok) {
    const detail = await resp.text().catch(() => '')
    const err = new Error(detail.slice(0, 300) || `模型服务返回 ${resp.status}`)
    err.status = resp.status
    throw err
  }

  const decoder = new TextDecoder()
  let buffer = ''
  let sentThinking = false

  for await (const chunk of resp.body) {
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
        yield { type: 'delta', text: delta.content }
      } else if (delta.reasoning_content && !sentThinking) {
        sentThinking = true
        yield { type: 'thinking' }
      }
    }
  }
}
