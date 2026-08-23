import { useEffect, useRef, useState } from 'react'
import { Reveal, SectionHead, Arrow } from './ui.jsx'
import { useContent, useLocale } from '../content/index.jsx'
import advisorAvatar from '../assets/logo/eva-logo.png'
import Band from './Band.jsx'

/**
 * 解析服务端归一化后的 SSE 协议，逐个吐出事件。
 * 事件形如 { type: 'thinking' } / { type: 'delta', text } / { type: 'done' } / { type: 'error' }
 * 思维链已在服务端过滤，前端拿不到也不需要。
 */
async function* streamChat(messages, signal, t, locale) {
  const resp = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, locale }),
    signal,
  })

  if (!resp.ok) {
    const info = await resp.json().catch(() => ({}))
    const err = new Error(info.message || t.errRequest(resp.status))
    err.code = info.error
    throw err
  }

  const reader = resp.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // SSE 以空行分隔事件；保留最后一段不完整的留到下一轮
    const events = buffer.split('\n\n')
    buffer = events.pop() ?? ''

    for (const evt of events) {
      const line = evt.split('\n').find((l) => l.startsWith('data:'))
      if (!line) continue
      const data = line.slice(5).trim()
      if (!data) continue
      try {
        yield JSON.parse(data)
      } catch {
        // 忽略解析不了的片段，不中断整条流
      }
    }
  }
}

export default function ChatConsult() {
  const { UI } = useContent()
  const locale = useLocale()
  const t = UI.chat
  const [messages, setMessages] = useState([{ role: 'assistant', content: t.opening }])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('idle') // idle | thinking | streaming | error
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)
  const abortRef = useRef(null)

  // 声明在 send 之前：send 依赖它，放后面虽能跑通但顺序上容易踩坑
  const busy = status === 'thinking' || status === 'streaming'

  // 新消息时滚到底部。用 scrollTop 而非 scrollIntoView，避免影响外层页面滚动
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, status])

  useEffect(() => () => abortRef.current?.abort(), [])

  async function send(text) {
    const content = text.trim()
    if (!content || busy) return

    const next = [...messages, { role: 'user', content }]
    setMessages([...next, { role: 'assistant', content: '' }])
    setInput('')
    setError(null)
    setStatus('streaming')

    const controller = new AbortController()
    abortRef.current = controller

    try {
      let acc = ''
      for await (const evt of streamChat(next, controller.signal, t, locale)) {
        if (evt.type === 'thinking') {
          // 推理模型在出正文前会先思考若干秒，给用户一个明确的等待状态
          setStatus('thinking')
        } else if (evt.type === 'delta') {
          acc += evt.text
          setStatus('streaming')
          setMessages((prev) => {
            const copy = [...prev]
            copy[copy.length - 1] = { role: 'assistant', content: acc }
            return copy
          })
        } else if (evt.type === 'error') {
          throw new Error(evt.message)
        }
      }
      if (!acc) throw new Error(t.errEmpty)
      setStatus('idle')
    } catch (e) {
      if (e.name === 'AbortError') return
      setError({ code: e.code, message: e.message })
      setStatus('error')
      // 移除占位的空回复
      setMessages((prev) => {
        const copy = [...prev]
        if (copy.at(-1)?.role === 'assistant' && !copy.at(-1).content) copy.pop()
        return copy
      })
    } finally {
      abortRef.current = null
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send(input)
    }
  }

  const notConfigured = error?.code === 'not_configured'

  return (
    <Band>
      <Reveal>
        {/* 不给编号：01–07 是既有的内容序列，这里是插入的交互模块，编号会打乱那条线 */}
        <SectionHead title={t.title} zh={t.sub} />
      </Reveal>

      <Reveal delay={80}>
        <div className="overflow-hidden rounded-3xl border border-ink/[0.09] bg-white">
          {/* 顾问抬头：128×128 形象在左上 */}
          <div className="flex items-center gap-5 border-b border-ink/[0.08] bg-cloud px-6 py-6 md:px-8">
            <img
              src={advisorAvatar}
              alt={t.advisor.avatarAlt}
              width="128"
              height="128"
              className="h-32 w-32 shrink-0 object-contain"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h3 className="font-display text-[20px] font-bold">{t.advisor.name}</h3>
                <span className="flex items-center gap-1.5 rounded-full bg-fox/10 px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-fox" />
                  <span className="font-mono text-[10px] tracking-wide text-fox">{t.online}</span>
                </span>
              </div>
              <p className="mt-1 text-[14px] text-ink/55">{t.advisor.role}</p>
              <p className="mt-2.5 text-[13px] leading-relaxed text-ink/45">
                {t.disclaimer}
              </p>
            </div>
          </div>

          {/* 对话区 */}
          <div ref={scrollRef} className="max-h-[420px] min-h-[260px] overflow-y-auto px-6 py-6 md:px-8">
            <div className="space-y-5">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[min(560px,85%)] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-[1.75] ${
                      m.role === 'user'
                        ? 'bg-fox text-white'
                        : 'bg-cloud text-ink/80'
                    }`}
                  >
                    {/* 推理模型出正文前会思考数秒，空气泡容易被当成卡住 */}
                    {status === 'thinking' && !m.content && i === messages.length - 1 ? (
                      <span className="flex items-center gap-2 text-ink/45">
                        <span className="flex gap-1">
                          {[0, 1, 2].map((d) => (
                            <span
                              key={d}
                              className="h-1.5 w-1.5 animate-bounce rounded-full bg-fox/60"
                              style={{ animationDelay: `${d * 140}ms` }}
                            />
                          ))}
                        </span>
                        <span className="text-[14px]">{t.thinking}</span>
                      </span>
                    ) : (
                      <>
                        {m.content}
                        {/* 流式输出时的光标 */}
                        {status === 'streaming' && i === messages.length - 1 && (
                          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-fox" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-amber/40 bg-amber/[0.07] px-4 py-3.5">
                <p className="text-[13.5px] leading-relaxed text-ink/75">
                  {notConfigured ? t.errNotConfigured : t.errPrefix}
                  {!notConfigured && <span className="text-ink/60">{error.message}</span>}
                </p>
                {notConfigured && (
                  <p className="mt-1.5 font-mono text-[11.5px] leading-relaxed text-ink/50">
                    {error.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 建议问题：仅在开场时出现 */}
          {messages.length === 1 && !error && (
            <div className="flex flex-wrap gap-2 px-6 pb-5 md:px-8">
              {t.suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={busy}
                  className="rounded-full border border-ink/12 px-3.5 py-2 text-[13px] text-ink/60 transition-colors hover:border-fox hover:text-fox disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* 输入区 */}
          <div className="border-t border-ink/[0.08] px-6 py-5 md:px-8">
            <div className="flex items-end gap-3">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={t.placeholder}
                className="max-h-32 min-h-[46px] flex-1 resize-none rounded-xl border border-ink/12 bg-cloud px-4 py-3 text-[15px] leading-relaxed text-ink transition-colors placeholder:text-ink/35 focus:border-fox focus:outline-none"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || busy}
                aria-label={t.send}
                className="group flex h-[46px] shrink-0 items-center gap-2 rounded-xl bg-fox px-5 font-display text-[14px] font-semibold text-white transition-all hover:bg-[#2a8ce8] disabled:pointer-events-none disabled:opacity-35"
              >
                {busy ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-white/40 border-t-white" />
                ) : (
                  <>
                    {t.send}
                    <Arrow className="group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </Band>
  )
}
