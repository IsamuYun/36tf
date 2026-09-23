import { useCallback, useEffect, useState } from 'react'
import { Plus, X, Send, RefreshCw, Database, Loader2 } from 'lucide-react'

/**
 * ATTOM Property API 测试页。独立于主站布局（无导航、页脚），
 * 请求经 /api/property 代理，密钥只在服务端；每次结果都写入 SQLite。
 */

const CUSTOM = '__custom__'

const toRows = (obj) => Object.entries(obj ?? {}).map(([key, value]) => ({ key, value: String(value) }))

async function getJson(url, init) {
  const res = await fetch(url, init)
  const body = await res.json().catch(() => ({}))
  return { res, body }
}

function StatusBadge({ code }) {
  const ok = code != null && code < 400
  const cls = code == null ? 'bg-ink/10 text-ink/60' : ok ? 'bg-fox/10 text-fox' : 'bg-amber/15 text-[#b36200]'
  return (
    <span className={`rounded-md px-2 py-0.5 font-mono text-[12px] ${cls}`}>{code ?? 'ERR'}</span>
  )
}

export default function PropertyPage() {
  const [meta, setMeta] = useState(null)
  const [selected, setSelected] = useState('')
  const [customPath, setCustomPath] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [properties, setProperties] = useState([])
  const [tab, setTab] = useState('history')

  useEffect(() => {
    document.title = 'ATTOM Property Tester'
    getJson('/api/property/endpoints')
      .then(({ body }) => {
        setMeta(body)
        const first = body.endpoints?.[0]
        if (first) {
          setSelected(first.path)
          setRows(toRows(first.sample))
        }
      })
      .catch(() => setError('无法连接后端 /api/property，确认 npm run dev 已启动'))
  }, [])

  const refresh = useCallback(() => {
    getJson('/api/property/history').then(({ body }) => setHistory(body.items ?? []))
    getJson('/api/property/properties').then(({ body }) => setProperties(body.items ?? []))
  }, [])

  useEffect(refresh, [refresh])

  const pickEndpoint = (path) => {
    setSelected(path)
    const ep = meta?.endpoints?.find((e) => e.path === path)
    if (ep) setRows(toRows(ep.sample))
  }

  const updateRow = (i, field, v) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [field]: v } : r)))

  const endpoint = selected === CUSTOM ? customPath.trim() : selected

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const params = Object.fromEntries(rows.filter((r) => r.key.trim()).map((r) => [r.key.trim(), r.value]))
      const { body } = await getJson('/api/property/query', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ endpoint, params }),
      })
      if (body.httpStatus === undefined && body.message) setError(body.message)
      else setResult(body)
      refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const openRecord = async (id) => {
    const { body } = await getJson(`/api/property/history/${id}`)
    setResult({
      endpoint: body.endpoint,
      params: body.params,
      httpStatus: body.http_status,
      durationMs: body.duration_ms,
      requestId: body.id,
      data: body.response,
      fromHistory: body.created_at,
    })
  }

  const status = result?.data?.status

  return (
    <div className="min-h-screen bg-cloud">
      <header className="border-b border-ink/[0.08] bg-white">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5">
          <div>
            <h1 className="font-display text-[22px] font-bold">ATTOM Property API 测试</h1>
            <p className="mt-0.5 font-mono text-[12px] text-ink/45">{meta?.baseUrl ?? '…'}</p>
          </div>
          {meta && !meta.configured && (
            <span className="rounded-lg bg-amber/15 px-3 py-1.5 text-[13px] text-[#b36200]">
              未配置 ATTOM_API_KEY
            </span>
          )}
        </div>
      </header>

      <div className="wrap grid gap-6 py-8 lg:grid-cols-[380px_1fr]">
        {/* 左：请求表单 + 历史 */}
        <div className="space-y-6">
          <form onSubmit={submit} className="rounded-2xl border border-ink/[0.09] bg-white p-6">
            <label className="block text-[13px] font-semibold text-ink/60" htmlFor="ep">
              端点
            </label>
            <select
              id="ep"
              value={selected}
              onChange={(e) => pickEndpoint(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-[14px]"
            >
              {meta?.endpoints?.map((ep) => (
                <option key={ep.path} value={ep.path}>
                  {ep.label} — {ep.path}
                </option>
              ))}
              <option value={CUSTOM}>自定义路径…</option>
            </select>
            {selected === CUSTOM && (
              <input
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                placeholder="例如 school/snapshot"
                className="mt-2 w-full rounded-lg border border-ink/15 px-3 py-2 font-mono text-[13px]"
              />
            )}

            <div className="mt-5 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-ink/60">查询参数</span>
              <button
                type="button"
                onClick={() => setRows((rs) => [...rs, { key: '', value: '' }])}
                className="flex items-center gap-1 text-[13px] text-fox hover:underline"
              >
                <Plus size={14} /> 添加
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {rows.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={r.key}
                    onChange={(e) => updateRow(i, 'key', e.target.value)}
                    placeholder="key"
                    className="w-[38%] min-w-0 rounded-lg border border-ink/15 px-2.5 py-1.5 font-mono text-[13px]"
                  />
                  <input
                    value={r.value}
                    onChange={(e) => updateRow(i, 'value', e.target.value)}
                    placeholder="value"
                    className="min-w-0 flex-1 rounded-lg border border-ink/15 px-2.5 py-1.5 font-mono text-[13px]"
                  />
                  <button
                    type="button"
                    aria-label="删除参数"
                    onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                    className="px-1 text-ink/35 hover:text-ink"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !endpoint}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-fox py-2.5 font-semibold text-white transition hover:bg-current disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              发送并保存
            </button>
            {error && <p className="mt-3 text-[13px] text-[#b36200]">{error}</p>}
          </form>

          <section className="rounded-2xl border border-ink/[0.09] bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-1 rounded-lg bg-cloud p-1 text-[13px]">
                {[
                  ['history', `请求 ${history.length}`],
                  ['properties', `房产 ${properties.length}`],
                ].map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setTab(k)}
                    className={`rounded-md px-3 py-1 ${tab === k ? 'bg-white font-semibold shadow-sm' : 'text-ink/55'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button type="button" onClick={refresh} aria-label="刷新" className="text-ink/40 hover:text-fox">
                <RefreshCw size={15} />
              </button>
            </div>

            <ul className="mt-4 max-h-[420px] divide-y divide-ink/[0.06] overflow-y-auto">
              {tab === 'history' &&
                history.map((h) => (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => openRecord(h.id)}
                      className={`w-full py-2.5 text-left hover:bg-cloud ${result?.requestId === h.id ? 'bg-cloud' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <StatusBadge code={h.http_status} />
                        <span className="truncate font-mono text-[13px]">{h.endpoint}</span>
                        <span className="ml-auto shrink-0 text-[12px] text-ink/40">#{h.id}</span>
                      </div>
                      <div className="mt-1 truncate text-[12px] text-ink/45">
                        {Object.values(h.params).join(' · ') || '—'} · {h.created_at}
                      </div>
                    </button>
                  </li>
                ))}
              {tab === 'properties' &&
                properties.map((p) => (
                  <li key={p.attom_id} className="py-2.5">
                    <div className="text-[13px] font-medium">{p.address ?? '(无地址)'}</div>
                    <div className="mt-0.5 font-mono text-[12px] text-ink/45">
                      attomId {p.attom_id} · {p.endpoints.join(', ')}
                    </div>
                  </li>
                ))}
              {(tab === 'history' ? history : properties).length === 0 && (
                <li className="py-6 text-center text-[13px] text-ink/40">暂无记录</li>
              )}
            </ul>
          </section>
        </div>

        {/* 右：结果 */}
        <section className="min-w-0 rounded-2xl border border-ink/[0.09] bg-white p-6">
          {!result ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-2 text-ink/35">
              <Database size={28} strokeWidth={1.5} />
              <p className="text-[14px]">发送请求或点选历史记录查看结果</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
                <StatusBadge code={result.httpStatus} />
                <span className="font-mono">{result.endpoint}</span>
                {result.durationMs != null && <span className="text-ink/45">{result.durationMs} ms</span>}
                {status && (
                  <span className="text-ink/60">
                    {status.msg} · total {status.total ?? '—'}
                  </span>
                )}
                <span className="ml-auto text-ink/45">
                  {result.fromHistory
                    ? `记录 #${result.requestId} · ${result.fromHistory}`
                    : result.requestId
                      ? `已保存 #${result.requestId} · 房产 ${result.savedProperties} 条`
                      : '未保存'}
                </span>
              </div>
              <pre className="mt-4 max-h-[75vh] overflow-auto rounded-xl bg-ink p-4 font-mono text-[12px] leading-relaxed text-cloud/90">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
