import { useCallback, useEffect, useRef, useState } from 'react'
import { Building2, MapPin, Search, Send, Ruler, CalendarDays, Layers, ExternalLink, Lock } from 'lucide-react'
import logo from '../assets/logo/eva-logo.png'

/**
 * CRESpan：自然语言查商业地产。
 *
 * 独立页面，不套主站导航与页脚。前端只认服务端归一化后的 SSE 协议：
 *   { type: 'status', stage }      解析意图 / 检索数据 / 组织语言
 *   { type: 'results', payload }   ATTOM 检索结果，用来渲染卡片
 *   { type: 'thinking' }           推理模型正在思考
 *   { type: 'delta', text }        正文增量
 *   { type: 'done' | 'error' }
 * 密钥全部在服务端，浏览器侧没有任何 API key。
 */

const SUGGESTIONS = [
  '查一下 90210 周边 10 英里内的 10 家仓库',
  '92602 附近 10 英里有哪些餐馆？给我 10 家',
  'Find 10 commercial properties within 10 miles of 10001',
]

const STAGE_TEXT = {
  intent: '正在理解你的问题…',
  search: '正在检索 ATTOM 房产数据…',
  writing: '正在整理结果…',
}

const CATEGORY_LABEL = { warehouse: '仓库', restaurant: '餐馆', commercial: '商业地产' }

const num = (v) => (v == null ? null : Number(v).toLocaleString('en-US'))

/** 解析服务端 SSE，逐个吐出事件 */
async function* streamChat(messages, signal) {
  const resp = await fetch('/api/crespan/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  })

  if (!resp.ok) {
    const info = await resp.json().catch(() => ({}))
    const err = new Error(info.message || `请求失败（${resp.status}）`)
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

    // SSE 以空行分隔事件；最后一段可能不完整，留到下一轮
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

function Dot({ ok }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-fox' : 'bg-amber'}`} />
}

function PropertyCard({ p, index }) {
  const facts = [
    { icon: Ruler, label: '建筑面积', value: p.buildingSize ? `${num(p.buildingSize)} sqft` : null },
    { icon: Layers, label: '地块', value: p.lotAcres ? `${p.lotAcres} acres` : null },
    { icon: CalendarDays, label: '建成年份', value: p.yearBuilt || null },
  ].filter((f) => f.value)

  return (
    <li className="rounded-2xl border border-ink/[0.09] bg-white p-4 transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(13,27,46,0.55)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-fox/10 font-mono text-[11px] text-fox">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[14.5px] font-semibold text-ink">
            {p.oneLine ?? p.address ?? '地址未公开'}
          </p>
          <p className="mt-0.5 truncate text-[12.5px] text-ink/50">
            {p.propType ?? '—'}
            {p.propClass ? ` · ${p.propClass}` : ''}
          </p>
        </div>
        {p.distance != null && (
          <span className="shrink-0 rounded-md bg-cloud px-2 py-1 font-mono text-[11px] text-ink/60">
            {p.distance.toFixed(1)} mi
          </span>
        )}
      </div>

      {facts.length > 0 && (
        <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-ink/[0.07] pt-3">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="flex items-center gap-1 text-[10.5px] text-ink/40">
                <f.icon className="h-3 w-3" strokeWidth={1.8} />
                {f.label}
              </dt>
              <dd className="mt-0.5 font-mono text-[12px] text-ink/75">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[10.5px] text-ink/35">ATTOM {p.attomId ?? '—'}</span>
        {p.lat != null && p.lon != null && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 font-mono text-[10.5px] text-fox hover:underline"
          >
            地图 <ExternalLink className="h-3 w-3" strokeWidth={1.8} />
          </a>
        )}
      </div>
    </li>
  )
}

function ResultsPanel({ searches, active, onPick }) {
  const s = searches[active]

  if (!s) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
        <Building2 className="h-8 w-8 text-ink/15" strokeWidth={1.4} />
        <p className="text-[13.5px] leading-relaxed text-ink/40">
          检索结果会显示在这里。
          <br />
          说一个邮编和业态即可，例如「90210 附近 10 英里内的 10 家仓库」。
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-ink/[0.08] px-5 py-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-fox" strokeWidth={1.8} />
          <h2 className="font-display text-[15px] font-bold">
            {s.origin.zip} {s.origin.city ? `· ${s.origin.city}` : ''} {s.origin.state ?? ''}
          </h2>
        </div>
        <p className="mt-1 text-[12.5px] text-ink/50">
          {CATEGORY_LABEL[s.category] ?? s.category} · 半径 {s.radius} 英里 · 返回 {s.items.length} 条
          {s.total ? ` · 范围内约 ${num(s.total)} 处` : ''}
        </p>
        {s.items.length > 0 && s.searchedRadius < s.radius && (
          <p className="mt-1 text-[11.5px] text-ink/40">最近的 {s.items.length} 条都在 {s.searchedRadius} 英里内</p>
        )}
        {s.partial?.length > 0 && (
          <p className="mt-1 font-mono text-[11px] text-amber">
            {s.partial.join(' / ')} 分类本次未返回，结果可能不完整
          </p>
        )}

        {searches.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {searches.map((item, i) => (
              <button
                key={i}
                onClick={() => onPick(i)}
                className={`rounded-full px-2.5 py-1 font-mono text-[10.5px] transition-colors ${
                  i === active ? 'bg-fox text-white' : 'bg-cloud text-ink/50 hover:text-fox'
                }`}
              >
                {item.origin.zip} · {CATEGORY_LABEL[item.category] ?? item.category}
              </button>
            ))}
          </div>
        )}
      </div>

      <ul className="flex-1 space-y-2.5 overflow-y-auto bg-cloud/60 p-4">
        {s.items.length === 0 && (
          <li className="rounded-2xl border border-ink/[0.09] bg-white p-5 text-[13.5px] leading-relaxed text-ink/55">
            已扫描 {s.searchedRadius} 英里范围，ATTOM 在这里没有该业态的登记记录。
            <br />
            可以换个邮编，或把半径放大到 20 英里再试。
          </li>
        )}
        {s.items.map((p, i) => (
          <PropertyCard key={p.attomId ?? i} p={p} index={i} />
        ))}
      </ul>
    </div>
  )
}

/**
 * 门禁页：Demo 下线时只剩一句说明，需要访问码时给一个输入框。
 * 这层只挡界面，真正拦人的是服务端——没有 cookie，/api/crespan/chat 一律 401。
 */
function GatePage({ gate, onUnlocked }) {
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const offline = !gate.enabled

  const submit = async (e) => {
    e.preventDefault()
    if (!code.trim() || busy) return
    setBusy(true)
    setError('')
    try {
      const resp = await fetch('/api/crespan/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      })
      const body = await resp.json().catch(() => ({}))
      if (!resp.ok) throw new Error(body.message || '访问码不对。')
      onUnlocked()
    } catch (err) {
      setError(err.message)
      setCode('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cloud px-6">
      <div className="w-full max-w-[380px] text-center">
        <img src={logo} alt="CRESpan" width="64" height="64" className="mx-auto h-16 w-16 object-contain" />
        <h1 className="mt-4 font-display text-[26px] font-bold tracking-tight">CRESpan</h1>

        {offline ? (
          <>
            <p className="mt-3 text-[15px] text-ink/60">Demo 暂未开放。</p>
            <p className="mt-1.5 text-[13.5px] text-ink/45">如需演示，请联系 36 Tech。</p>
          </>
        ) : (
          <>
            <p className="mt-3 text-[14px] leading-relaxed text-ink/55">
              这是内部演示，请输入访问码。
            </p>
            <form onSubmit={submit} className="mt-6 flex gap-2">
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoFocus
                autoComplete="off"
                placeholder="访问码"
                aria-label="访问码"
                className="h-[46px] flex-1 rounded-xl border border-ink/12 bg-white px-4 text-[15px] text-ink transition-colors placeholder:text-ink/35 focus:border-fox focus:outline-none"
              />
              <button
                type="submit"
                disabled={!code.trim() || busy}
                className="h-[46px] shrink-0 rounded-xl bg-fox px-5 font-display text-[14px] font-semibold text-white transition-colors hover:bg-[#2a8ce8] disabled:pointer-events-none disabled:opacity-35"
              >
                {busy ? '…' : '进入'}
              </button>
            </form>
            {error && <p className="mt-3 text-[13px] text-amber">{error}</p>}
            <p className="mt-6 text-[12.5px] text-ink/40">没有访问码？请联系 36 Tech。</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function CrespanPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        '我是 CRESpan，用自然语言帮你查美国商业地产。\n给我一个 5 位邮编和想找的业态——仓库、餐馆或商业地产——我就去 ATTOM 的数据里找方圆 10 英里内的房产。',
    },
  ])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('idle') // idle | thinking | streaming | error
  const [stage, setStage] = useState(null)
  const [error, setError] = useState(null)
  const [searches, setSearches] = useState([])
  const [active, setActive] = useState(0)
  const [tab, setTab] = useState('chat') // 仅窄屏使用
  const [meta, setMeta] = useState(null)
  const scrollRef = useRef(null)
  const abortRef = useRef(null)

  const busy = status === 'thinking' || status === 'streaming'

  const loadMeta = useCallback(
    () =>
      fetch('/api/crespan/meta')
        .then((r) => r.json())
        .then(setMeta)
        .catch(() => setMeta(null)),
    [],
  )

  useEffect(() => {
    document.title = 'CRESpan · 商业地产智能检索'
    loadMeta()
    return () => abortRef.current?.abort()
  }, [loadMeta])

  // 新消息滚到底部。用 scrollTop 而非 scrollIntoView，避免影响外层滚动
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, status, stage])

  async function send(text) {
    const content = text.trim()
    if (!content || busy) return

    const next = [...messages, { role: 'user', content }]
    setMessages([...next, { role: 'assistant', content: '' }])
    setInput('')
    setError(null)
    setStatus('streaming')
    setStage('intent')

    const controller = new AbortController()
    abortRef.current = controller

    try {
      let acc = ''
      for await (const evt of streamChat(next, controller.signal)) {
        if (evt.type === 'status') {
          setStage(evt.stage)
        } else if (evt.type === 'thinking') {
          setStatus('thinking')
        } else if (evt.type === 'results') {
          // 结果先落地渲染卡片，模型的文字说明随后再流出来
          setSearches((prev) => {
            const list = [...prev, evt.payload]
            setActive(list.length - 1)
            return list
          })
          setMessages((prev) => {
            const copy = [...prev]
            copy[copy.length - 1] = { ...copy[copy.length - 1], search: evt.payload }
            return copy
          })
        } else if (evt.type === 'delta') {
          acc += evt.text
          setStatus('streaming')
          setStage(null)
          setMessages((prev) => {
            const copy = [...prev]
            copy[copy.length - 1] = { ...copy[copy.length - 1], role: 'assistant', content: acc }
            return copy
          })
        } else if (evt.type === 'error') {
          throw new Error(evt.message)
        }
      }
      if (!acc) throw new Error('模型没有返回内容，请重试。')
      setStatus('idle')
      setStage(null)
    } catch (e) {
      if (e.name === 'AbortError') return
      setError({ code: e.code, message: e.message })
      setStatus('error')
      setStage(null)
      // 访问码被换掉或 Demo 中途下线：重新问一次状态，回到门禁页
      if (e.code === 'locked' || e.code === 'disabled') loadMeta()
      // 移除没有内容也没有结果的占位回复
      setMessages((prev) => {
        const copy = [...prev]
        const last = copy.at(-1)
        if (last?.role === 'assistant' && !last.content && !last.search) copy.pop()
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

  const showResults = (payload) => {
    const i = searches.indexOf(payload)
    if (i >= 0) setActive(i)
    setTab('results')
  }

  const configured = meta ? meta.model?.configured && meta.attom?.configured : true
  const gate = meta?.gate

  const relock = async () => {
    await fetch('/api/crespan/lock', { method: 'POST' }).catch(() => {})
    window.location.reload()
  }

  // meta 还没回来时先不渲染，免得门禁页和正文一闪而过
  if (!meta) return <div className="min-h-dvh bg-cloud" />
  if (gate && (!gate.enabled || !gate.unlocked)) {
    return <GatePage gate={gate} onUnlocked={loadMeta} />
  }

  return (
    <div className="flex h-dvh flex-col bg-cloud">
      {/* 抬头 */}
      <header className="flex shrink-0 items-center justify-between border-b border-ink/[0.09] bg-white px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="CRESpan" width="40" height="40" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="font-display text-[19px] font-bold leading-none tracking-tight">CRESpan</h1>
            <p className="mt-1 text-[12px] text-ink/45">Commercial real estate, one question away</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full bg-cloud px-2.5 py-1 font-mono text-[10.5px] text-ink/55 sm:flex">
            <Dot ok={meta?.model?.configured !== false} /> Qwen
          </span>
          <span className="hidden items-center gap-1.5 rounded-full bg-cloud px-2.5 py-1 font-mono text-[10.5px] text-ink/55 sm:flex">
            <Dot ok={meta?.attom?.configured !== false} /> ATTOM
          </span>
          {/* 用完在别人电脑上点一下，就回到要码的状态 */}
          {gate?.required && (
            <button
              onClick={relock}
              title="锁定 Demo"
              aria-label="锁定 Demo"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-cloud text-ink/45 transition-colors hover:text-fox"
            >
              <Lock className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          )}
          {/* 窄屏切换对话 / 结果 */}
          <div className="flex rounded-full bg-cloud p-0.5 lg:hidden">
            {[
              ['chat', '对话'],
              ['results', `结果${searches.length ? ` ${searches[active]?.items.length ?? 0}` : ''}`],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-full px-3 py-1.5 text-[12px] transition-colors ${
                  tab === key ? 'bg-fox text-white' : 'text-ink/55'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {!configured && (
        <div className="shrink-0 border-b border-amber/40 bg-amber/[0.08] px-4 py-2.5 text-[12.5px] text-ink/70 md:px-6">
          尚未配置 {[...(meta?.model?.missing ?? []), ...(meta?.attom?.configured ? [] : ['ATTOM_API_KEY'])].join('、')}
          ，请在 .env 中填写后重启 API 服务。
        </div>
      )}

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* 对话 */}
        {/* 窄屏一次只显示一栏，宽屏两栏并排 */}
        <section className={`min-h-0 flex-col ${tab === 'chat' ? 'flex' : 'hidden'} lg:flex`}>
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <div className="mx-auto max-w-[760px] space-y-5">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[min(620px,88%)]">
                    <div
                      className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-[1.75] ${
                        m.role === 'user' ? 'bg-fox text-white' : 'bg-white text-ink/85 shadow-[0_1px_0_rgba(13,27,46,0.06)]'
                      }`}
                    >
                      {stage && !m.content && i === messages.length - 1 ? (
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
                          <span className="text-[14px]">{STAGE_TEXT[stage] ?? '处理中…'}</span>
                        </span>
                      ) : (
                        <>
                          {m.content}
                          {status === 'streaming' && i === messages.length - 1 && (
                            <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-fox" />
                          )}
                        </>
                      )}
                    </div>

                    {/* 命中检索的回复，附一条结果摘要 */}
                    {m.search && (
                      <button
                        onClick={() => showResults(m.search)}
                        className="mt-2 flex w-full items-center gap-2 rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-left transition-colors hover:border-fox"
                      >
                        <Search className="h-3.5 w-3.5 shrink-0 text-fox" strokeWidth={1.8} />
                        <span className="min-w-0 flex-1 truncate text-[13px] text-ink/70">
                          {m.search.origin.zip} 周边 {m.search.radius} 英里 ·{' '}
                          {CATEGORY_LABEL[m.search.category] ?? m.search.category} · {m.search.items.length} 条
                        </span>
                        <span className="shrink-0 font-mono text-[11px] text-fox">查看</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="mx-auto mt-5 max-w-[760px] rounded-xl border border-amber/40 bg-amber/[0.07] px-4 py-3.5">
                <p className="text-[13.5px] leading-relaxed text-ink/75">{error.message}</p>
              </div>
            )}
          </div>

          {/* 建议问题：仅开场时出现 */}
          {messages.length === 1 && !error && (
            <div className="mx-auto flex w-full max-w-[760px] flex-wrap gap-2 px-4 pb-3 md:px-8">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={busy}
                  className="rounded-full border border-ink/12 bg-white px-3.5 py-2 text-[13px] text-ink/60 transition-colors hover:border-fox hover:text-fox disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* 输入区 */}
          <div className="shrink-0 border-t border-ink/[0.08] bg-white px-4 py-4 md:px-8">
            <div className="mx-auto flex max-w-[760px] items-end gap-3">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="例如：90210 附近 10 英里内的 10 家仓库"
                className="max-h-32 min-h-[46px] flex-1 resize-none rounded-xl border border-ink/12 bg-cloud px-4 py-3 text-[15px] leading-relaxed text-ink transition-colors placeholder:text-ink/35 focus:border-fox focus:outline-none"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || busy}
                aria-label="发送"
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-fox text-white transition-colors hover:bg-[#2a8ce8] disabled:pointer-events-none disabled:opacity-35"
              >
                {busy ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-white/40 border-t-white" />
                ) : (
                  <Send className="h-4 w-4" strokeWidth={1.8} />
                )}
              </button>
            </div>
            <p className="mx-auto mt-2 max-w-[760px] text-[11.5px] text-ink/35">
              数据来自 ATTOM Property API，仅供参考，不构成估值或投资建议。
            </p>
          </div>
        </section>

        {/* 结果 */}
        <aside
          className={`min-h-0 border-ink/[0.09] bg-white lg:block lg:border-l ${
            tab === 'results' ? 'block' : 'hidden lg:block'
          }`}
        >
          <ResultsPanel searches={searches} active={active} onPick={setActive} />
        </aside>
      </div>
    </div>
  )
}
