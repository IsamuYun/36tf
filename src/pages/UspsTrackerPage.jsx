import { useEffect, useState } from 'react'
import { Search, Loader2, Package, MapPin, ChevronDown } from 'lucide-react'

/**
 * USPS 包裹追踪。独立页面，不套主站导航与页脚。
 * 请求经 /api/usps 代理，Consumer Key / Secret 只在服务端。
 */

const fmtTime = (t) => {
  if (!t) return ''
  const d = new Date(t)
  return Number.isNaN(d.getTime()) ? t : d.toLocaleString()
}

const place = (ev) => [ev.city, ev.state, ev.zip, ev.country].filter(Boolean).join(', ')

export default function UspsTrackerPage() {
  const [configured, setConfigured] = useState(null)
  const [id, setId] = useState('')
  const [mailingDate, setMailingDate] = useState('')
  const [zip, setZip] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [showRaw, setShowRaw] = useState(false)

  useEffect(() => {
    document.title = 'USPS Tracker'
    fetch('/api/usps/meta')
      .then((r) => r.json())
      .then((b) => setConfigured(b.configured))
      .catch(() => setError('无法连接后端 /api/usps，确认 npm run dev 已启动'))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const clean = id.replace(/[\s-]/g, '')
    if (!clean) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const qs = new URLSearchParams()
      if (mailingDate) qs.set('mailingDate', mailingDate)
      if (zip.trim()) qs.set('zip', zip.trim())
      const res = await fetch(`/api/usps/track/${encodeURIComponent(clean)}?${qs}`)
      const body = await res.json().catch(() => ({}))
      if (!res.ok) setError(body.message || `请求失败（${res.status}）`)
      else setResult(body.result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cloud">
      <header className="border-b border-ink/[0.08] bg-white">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-fox" />
            <h1 className="font-display text-[22px] font-bold">USPS 包裹追踪</h1>
          </div>
          {configured === false && (
            <span className="rounded-lg bg-amber/15 px-3 py-1.5 text-[13px] text-[#b36200]">
              未配置 USPS_CONSUMER_KEY / USPS_CONSUMER_SECRET
            </span>
          )}
        </div>
      </header>

      <main className="wrap py-8">
        <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-sm">
          <label className="block text-[13px] font-medium text-ink/60">追踪单号</label>
          <div className="mt-2 flex gap-2">
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="9400 1000 0000 0000 0000 00"
              className="min-w-0 flex-1 rounded-lg border border-ink/15 px-3 py-2.5 font-mono text-[15px] outline-none focus:border-fox"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !id.trim()}
              className="flex items-center gap-2 rounded-lg bg-fox px-4 py-2.5 text-[14px] font-medium text-white disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              查询
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-[12px] text-ink/50">
              寄件日期（可选）
              <input
                type="date"
                value={mailingDate}
                onChange={(e) => setMailingDate(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-ink/15 px-3 py-2 text-[14px] text-ink"
              />
            </label>
            <label className="text-[12px] text-ink/50">
              收件邮编（可选）
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="12345"
                className="mt-1 block w-full rounded-lg border border-ink/15 px-3 py-2 font-mono text-[14px] text-ink"
              />
            </label>
          </div>
        </form>

        {error && (
          <div className="mt-5 rounded-xl bg-amber/15 px-4 py-3 text-[14px] text-[#b36200]">{error}</div>
        )}

        {result && (
          <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-mono text-[13px] text-ink/50">{result.trackingNumber}</div>
              <span className="rounded-md bg-ink/5 px-2 py-0.5 font-mono text-[11px] text-ink/40">
                {result.version}
              </span>
            </div>
            <div className="mt-1 font-display text-[22px] font-bold">{result.status || '无状态'}</div>
            {result.summary && <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{result.summary}</p>}

            <dl className="mt-4 grid gap-x-6 gap-y-2 text-[13px] sm:grid-cols-2">
              {[
                ['邮件类型', result.mailClass],
                ['预计送达', result.expectedDelivery],
                ['始发', result.origin],
                ['目的地', result.destination],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <dt className="text-ink/45">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
            </dl>

            {result.events.length > 0 && (
              <ol className="mt-6 border-l-2 border-ink/10 pl-5">
                {result.events.map((ev, i) => (
                  <li key={i} className="relative pb-5 last:pb-0">
                    <span
                      className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white ${
                        i === 0 ? 'bg-fox' : 'bg-ink/25'
                      }`}
                    />
                    <div className={`text-[14px] ${i === 0 ? 'font-semibold' : ''}`}>{ev.type}</div>
                    <div className="mt-0.5 flex flex-wrap gap-x-3 text-[12px] text-ink/50">
                      <span>{fmtTime(ev.time)}</span>
                      {place(ev) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {place(ev)}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}

            <button
              type="button"
              onClick={() => setShowRaw((v) => !v)}
              className="mt-6 flex items-center gap-1 text-[12px] text-ink/45 hover:text-ink/70"
            >
              <ChevronDown className={`h-3.5 w-3.5 transition ${showRaw ? 'rotate-180' : ''}`} />
              原始报文
            </button>
            {showRaw && (
              <pre className="mt-2 max-h-[420px] overflow-auto rounded-lg bg-ink/[0.04] p-3 text-[12px]">
                {JSON.stringify(result.raw, null, 2)}
              </pre>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
