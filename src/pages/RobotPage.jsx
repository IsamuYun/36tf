import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Bot,
  Building2,
  MapPin,
  Send,
  Ruler,
  CalendarDays,
  Layers,
  ExternalLink,
  BedDouble,
  Bath,
  Receipt,
  TrendingUp,
  History,
  User,
  Search,
} from 'lucide-react'
import { GatePage } from './CrespanPage.jsx'

/**
 * Robot：像聊天一样问房产，左侧卡片展示 ATTOM 数据。
 *
 * 独立页面，不套主站导航与页脚。SSE 协议与 CRESpan 相同：
 *   { type: 'status', stage } / { type: 'results', payload } / { type: 'thinking' }
 *   { type: 'delta', text } / { type: 'done' | 'error' }
 * payload.kind 为 'lookup'（单套房产）或 'list'（邮编列表 / 周边业态）。
 * 门禁与 CRESpan 共用同一个访问码与 cookie。
 */

const SUGGESTIONS = [
  '4529 Winona Court, Denver, CO 值多少钱？',
  '查一下 4529 Winona Court, Denver, CO 的成交记录',
  '列出 80212 的 10 套房产',
  'Find 10 warehouses within 10 miles of 90210',
]

const STAGE_TEXT = {
  intent: '正在理解你的问题…',
  search: '正在查询 ATTOM 房产数据…',
  writing: '正在整理结果…',
}

const num = (v) => (v == null ? null : Number(v).toLocaleString('en-US'))
const usd = (v) => (v == null ? null : `$${Math.round(Number(v)).toLocaleString('en-US')}`)
const mapUrl = (p) => `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`

async function* streamChat(messages, signal) {
  const resp = await fetch('/api/robot/chat', {
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
        // 忽略解析不了的片段
      }
    }
  }
}

/** 结果的简短标签：对话里的摘要按钮、左侧的历史切换都用它 */
function resultLabel(r) {
  if (r.kind === 'lookup') return r.profile.oneLine ?? `${r.query.address1}, ${r.query.address2}`
  if (r.origin) return `${r.origin.zip} 周边 ${r.radius} mi · ${r.categoryLabel?.zh ?? r.category} · ${r.items.length} 条`
  return `${r.zip} · ${r.items.length} 套`
}

function Dot({ ok }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-fox' : 'bg-amber'}`} />
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-ink/[0.09] bg-white p-4">
      <h3 className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink/45">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

/** 键值网格，空值自动隐藏 */
function Facts({ rows, cols = 2 }) {
  const shown = rows.filter(([, v]) => v != null && v !== '')
  if (!shown.length) return <p className="text-[12.5px] text-ink/40">ATTOM 未提供</p>
  return (
    <dl className={`grid gap-x-4 gap-y-2.5 ${cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {shown.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="text-[10.5px] text-ink/40">{k}</dt>
          <dd className="mt-0.5 truncate font-mono text-[12.5px] text-ink/80" title={String(v)}>
            {v}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** 估值区间条：low—high 之间标出点估值的位置 */
function ValueBar({ value }) {
  const { low, high } = value
  const pct = low != null && high != null && high > low ? ((value.value - low) / (high - low)) * 100 : 50
  return (
    <div className="mt-3">
      <div className="relative h-1.5 rounded-full bg-fox/15">
        <span
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-fox shadow"
          style={{ left: `${Math.min(Math.max(pct, 0), 100)}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10.5px] text-ink/45">
        <span>{usd(low) ?? '—'}</span>
        <span>{usd(high) ?? '—'}</span>
      </div>
    </div>
  )
}

function LookupCards({ r }) {
  const p = r.profile
  const b = p.building
  const v = r.value

  return (
    <div className="space-y-3">
      {/* 抬头：地址与类型 */}
      <section className="rounded-2xl border border-ink/[0.09] bg-white p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-fox/10">
            <Building2 className="h-4.5 w-4.5 text-fox" strokeWidth={1.8} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[15.5px] font-semibold leading-snug text-ink">
              {p.oneLine ?? '地址未公开'}
            </p>
            <p className="mt-1 text-[12.5px] text-ink/50">
              {[p.propType, p.subdivision, p.county && `${p.county} County`].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 border-t border-ink/[0.07] pt-3">
          {[
            [BedDouble, '卧室', b.beds],
            [Bath, '卫浴', b.baths],
            [Ruler, '面积', b.livingSize ? `${num(b.livingSize)} sf` : null],
            [CalendarDays, '建成', p.yearBuilt],
          ].map(([Icon, label, val]) => (
            <div key={label}>
              <dt className="flex items-center gap-1 text-[10.5px] text-ink/40">
                <Icon className="h-3 w-3" strokeWidth={1.8} />
                {label}
              </dt>
              <dd className="mt-0.5 font-mono text-[12.5px] text-ink/80">{val ?? '—'}</dd>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[10.5px] text-ink/35">
            ATTOM {p.attomId ?? '—'}
            {p.apn ? ` · APN ${p.apn}` : ''}
          </span>
          {p.lat != null && p.lon != null && (
            <a
              href={mapUrl(p)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-mono text-[10.5px] text-fox hover:underline"
            >
              地图 <ExternalLink className="h-3 w-3" strokeWidth={1.8} />
            </a>
          )}
        </div>
      </section>

      {/* 估值 */}
      {v && (
        <Section icon={TrendingUp} title="估值 AVM">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-display text-[26px] font-bold tracking-tight text-ink">{usd(v.value)}</span>
            {v.monthChangePct != null && v.monthChangePct !== 0 && (
              <span className={`font-mono text-[12px] ${v.monthChangePct > 0 ? 'text-fox' : 'text-amber'}`}>
                {v.monthChangePct > 0 ? '+' : ''}
                {v.monthChangePct}% 较上月
              </span>
            )}
          </div>
          <ValueBar value={v} />
          <p className="mt-2 text-[11.5px] text-ink/45">
            {[
              v.confidence != null && `置信分 ${v.confidence}/100`,
              v.perSqft && `$${num(v.perSqft)}/sf`,
              v.date && `估算于 ${v.date}`,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </Section>
      )}
      {r.missing?.includes('value') && (
        <p className="px-1 font-mono text-[11px] text-amber">估值接口本次未返回</p>
      )}

      <Section icon={Receipt} title="上次成交 · 税务">
        <Facts
          rows={[
            ['成交价', usd(p.lastSale.amount)],
            ['成交日期', p.lastSale.date],
            ['每平方英尺', p.lastSale.pricePerSqft ? `$${num(p.lastSale.pricePerSqft)}` : null],
            ['交易类型', p.lastSale.type],
            ['市场评估总值', usd(p.assessment.marketTotal)],
            ['其中土地', usd(p.assessment.marketLand)],
            [`房产税${p.assessment.taxYear ? `（${p.assessment.taxYear}）` : ''}`, usd(p.assessment.tax)],
            ['计税评估值', usd(p.assessment.assessedTotal)],
          ]}
        />
      </Section>

      <Section icon={Layers} title="建筑与地块">
        <Facts
          rows={[
            ['地块', p.lot.acres ? `${p.lot.acres} acres${p.lot.sqft ? ` / ${num(p.lot.sqft)} sf` : ''}` : null],
            ['分区', p.lot.zoning],
            ['层数', b.levels],
            ['房况', b.condition],
            ['外墙', b.wall],
            ['车位', b.parking],
            ['制冷', b.cooling],
            ['供暖', b.heating],
          ]}
        />
      </Section>

      {r.sales && (
        <Section icon={History} title={`成交记录 · ${r.sales.length} 笔`}>
          {r.sales.length === 0 ? (
            <p className="text-[12.5px] text-ink/40">ATTOM 没有该房产的成交记录</p>
          ) : (
            <ol className="relative space-y-3 border-l border-ink/10 pl-4">
              {r.sales.map((s, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-fox" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-[12px] text-ink/55">{s.date ?? '日期未知'}</span>
                    <span className="font-mono text-[13px] font-semibold text-ink">{usd(s.amount) ?? '未披露'}</span>
                  </div>
                  <p className="text-[11.5px] text-ink/40">
                    {[s.type, s.pricePerSqft && `$${num(s.pricePerSqft)}/sf`].filter(Boolean).join(' · ')}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </Section>
      )}
      {r.missing?.includes('sales') && (
        <p className="px-1 font-mono text-[11px] text-amber">成交记录接口本次未返回</p>
      )}

      {(p.owner.names.length > 0 || p.occupancy) && (
        <Section icon={User} title="业主（公开登记）">
          <Facts
            cols={2}
            rows={[
              ['业主', p.owner.names.join('、') || null],
              ['类型', p.owner.type],
              ['居住情况', p.occupancy],
            ]}
          />
        </Section>
      )}
    </div>
  )
}

function ListCards({ r, onAsk }) {
  if (!r.items.length) {
    return (
      <p className="rounded-2xl border border-ink/[0.09] bg-white p-5 text-[13.5px] leading-relaxed text-ink/55">
        ATTOM 在这里没有找到登记记录，换个邮编或放大半径再试。
      </p>
    )
  }
  return (
    <ul className="space-y-2.5">
      {r.items.map((p, i) => {
        const facts = [
          [Ruler, p.buildingSize ? `${num(p.buildingSize)} sf` : null],
          [Layers, p.lotAcres ? `${p.lotAcres} ac` : null],
          [CalendarDays, p.yearBuilt],
        ].filter(([, v]) => v)
        return (
          <li
            key={p.attomId ?? i}
            className="rounded-2xl border border-ink/[0.09] bg-white p-4 transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(13,27,46,0.55)]"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-fox/10 font-mono text-[11px] text-fox">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[14px] font-semibold text-ink">{p.oneLine ?? '地址未公开'}</p>
                <p className="mt-0.5 truncate text-[12px] text-ink/50">{p.propType ?? '—'}</p>
              </div>
              {p.distance != null && (
                <span className="shrink-0 rounded-md bg-cloud px-2 py-1 font-mono text-[11px] text-ink/60">
                  {Number(p.distance).toFixed(1)} mi
                </span>
              )}
            </div>
            <div className="mt-2.5 flex items-center gap-3 border-t border-ink/[0.07] pt-2.5">
              {facts.map(([Icon, v], k) => (
                <span key={k} className="flex items-center gap-1 font-mono text-[11.5px] text-ink/60">
                  <Icon className="h-3 w-3 text-ink/35" strokeWidth={1.8} />
                  {v}
                </span>
              ))}
              <span className="flex-1" />
              {p.oneLine && (
                <button
                  onClick={() => onAsk(`查一下 ${p.oneLine} 的详情和估值`)}
                  className="font-mono text-[11px] text-fox hover:underline"
                >
                  详情
                </button>
              )}
              {p.lat != null && p.lon != null && (
                <a
                  href={mapUrl(p)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-0.5 font-mono text-[11px] text-fox hover:underline"
                >
                  地图 <ExternalLink className="h-3 w-3" strokeWidth={1.8} />
                </a>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function ResultsPanel({ results, active, onPick, onAsk }) {
  const r = results[active]

  if (!r) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
        <Building2 className="h-8 w-8 text-ink/15" strokeWidth={1.4} />
        <p className="text-[13.5px] leading-relaxed text-ink/40">
          房产信息会以卡片显示在这里。
          <br />
          问一个具体地址，或者一个邮编。
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-ink/[0.08] px-5 py-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-fox" strokeWidth={1.8} />
          <h2 className="truncate font-display text-[15px] font-bold">{resultLabel(r)}</h2>
        </div>
        {r.kind === 'list' && r.total != null && (
          <p className="mt-1 text-[12.5px] text-ink/50">
            返回 {r.items.length} 条 · 范围内约 {num(r.total)} 处
          </p>
        )}
        {results.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {results.map((item, i) => (
              <button
                key={i}
                onClick={() => onPick(i)}
                title={resultLabel(item)}
                className={`max-w-[180px] truncate rounded-full px-2.5 py-1 font-mono text-[10.5px] transition-colors ${
                  i === active ? 'bg-fox text-white' : 'bg-cloud text-ink/50 hover:text-fox'
                }`}
              >
                {resultLabel(item)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-cloud/60 p-4">
        {r.kind === 'lookup' ? <LookupCards r={r} /> : <ListCards r={r} onAsk={onAsk} />}
      </div>
    </div>
  )
}

export default function RobotPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        '你好，我是房产机器人。\n给我一个美国地址，我可以查它的档案、估值和成交记录；给我一个邮编，我可以列出那里的房产，或者周边的仓库、餐馆、商业地产。',
    },
  ])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('idle') // idle | thinking | streaming | error
  const [stage, setStage] = useState(null)
  const [error, setError] = useState(null)
  const [results, setResults] = useState([])
  const [active, setActive] = useState(0)
  const [tab, setTab] = useState('chat') // 仅窄屏使用
  const [meta, setMeta] = useState(null)
  const scrollRef = useRef(null)
  const abortRef = useRef(null)

  const busy = status === 'thinking' || status === 'streaming'

  const loadMeta = useCallback(
    () =>
      fetch('/api/robot/meta')
        .then((r) => r.json())
        .then(setMeta)
        .catch(() => setMeta({})),
    [],
  )

  useEffect(() => {
    document.title = 'Robot · 房产修改'
    loadMeta()
    return () => abortRef.current?.abort()
  }, [loadMeta])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, status, stage])

  async function send(text) {
    const content = text.trim()
    if (!content || busy) return

    // 只把文字发给服务端，卡片数据留在前端
    const next = [...messages, { role: 'user', content }]
    setMessages([...next, { role: 'assistant', content: '' }])
    setInput('')
    setError(null)
    setStatus('streaming')
    setStage('intent')
    setTab('chat')

    const controller = new AbortController()
    abortRef.current = controller

    try {
      let acc = ''
      const payload = next.map(({ role, content }) => ({ role, content }))
      for await (const evt of streamChat(payload, controller.signal)) {
        if (evt.type === 'status') {
          setStage(evt.stage)
        } else if (evt.type === 'thinking') {
          setStatus('thinking')
        } else if (evt.type === 'results') {
          setResults((prev) => {
            const list = [...prev, evt.payload]
            setActive(list.length - 1)
            return list
          })
          setMessages((prev) => {
            const copy = [...prev]
            copy[copy.length - 1] = { ...copy[copy.length - 1], result: evt.payload }
            return copy
          })
        } else if (evt.type === 'delta') {
          acc += evt.text
          setStatus('streaming')
          setStage(null)
          setMessages((prev) => {
            const copy = [...prev]
            copy[copy.length - 1] = { ...copy[copy.length - 1], content: acc }
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
      setError(e.message)
      setStatus('error')
      setStage(null)
      if (e.code === 'locked' || e.code === 'disabled') loadMeta()
      setMessages((prev) => {
        const copy = [...prev]
        const last = copy.at(-1)
        if (last?.role === 'assistant' && !last.content && !last.result) copy.pop()
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

  const showResult = (payload) => {
    const i = results.indexOf(payload)
    if (i >= 0) setActive(i)
    setTab('results')
  }

  if (!meta) return <div className="min-h-dvh bg-cloud" />
  const gate = meta.gate
  if (gate && (!gate.enabled || !gate.unlocked)) {
    return <GatePage gate={gate} onUnlocked={loadMeta} title="Robot" />
  }
  const missing = [...(meta.model?.missing ?? []), ...(meta.attom && !meta.attom.configured ? ['ATTOM_API_KEY'] : [])]

  return (
    <div className="flex h-dvh flex-col bg-cloud">
      <header className="flex shrink-0 items-center justify-between border-b border-ink/[0.09] bg-white px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fox text-white">
            <Bot className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <div>
            <h1 className="font-display text-[19px] font-bold leading-none tracking-tight">Robot</h1>
            <p className="mt-1 text-[12px] text-ink/45">Ask anything about a US property</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full bg-cloud px-2.5 py-1 font-mono text-[10.5px] text-ink/55 sm:flex">
            <Dot ok={meta.model?.configured !== false} /> Qwen
          </span>
          <span className="hidden items-center gap-1.5 rounded-full bg-cloud px-2.5 py-1 font-mono text-[10.5px] text-ink/55 sm:flex">
            <Dot ok={meta.attom?.configured !== false} /> ATTOM
          </span>
          <div className="flex rounded-full bg-cloud p-0.5 lg:hidden">
            {[
              ['chat', '对话'],
              ['results', `卡片${results.length ? ` ${results.length}` : ''}`],
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

      {missing.length > 0 && (
        <div className="shrink-0 border-b border-amber/40 bg-amber/[0.08] px-4 py-2.5 text-[12.5px] text-ink/70 md:px-6">
          尚未配置 {missing.join('、')}，请在 .env 中填写后重启 API 服务。
        </div>
      )}

      <div className="grid min-h-0 flex-1 lg:grid-cols-[440px_minmax(0,1fr)]">
        <aside
          className={`min-h-0 border-ink/[0.09] bg-white lg:block lg:border-r ${
            tab === 'results' ? 'block' : 'hidden lg:block'
          }`}
        >
          <ResultsPanel
            results={results}
            active={active}
            onPick={setActive}
            onAsk={(q) => send(q)}
          />
        </aside>
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

                    {m.result && (
                      <button
                        onClick={() => showResult(m.result)}
                        className="mt-2 flex w-full items-center gap-2 rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-left transition-colors hover:border-fox"
                      >
                        <Search className="h-3.5 w-3.5 shrink-0 text-fox" strokeWidth={1.8} />
                        <span className="min-w-0 flex-1 truncate text-[13px] text-ink/70">{resultLabel(m.result)}</span>
                        <span className="shrink-0 font-mono text-[11px] text-fox">查看</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="mx-auto mt-5 max-w-[760px] rounded-xl border border-amber/40 bg-amber/[0.07] px-4 py-3.5">
                <p className="text-[13.5px] leading-relaxed text-ink/75">{error}</p>
              </div>
            )}
          </div>

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

          <div className="shrink-0 border-t border-ink/[0.08] bg-white px-4 py-4 md:px-8">
            <div className="mx-auto flex max-w-[760px] items-end gap-3">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="例如：4529 Winona Court, Denver, CO 值多少钱？"
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
              数据来自 ATTOM Property API，估值为模型估算，仅供参考，不构成投资建议。
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
