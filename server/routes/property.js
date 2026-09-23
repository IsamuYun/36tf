import { Router } from 'express'
import { config } from '../config.js'
import { saveResult, listRequests, getRequest, listProperties } from '../db.js'

const router = Router()

/**
 * 测试页可选的 ATTOM Property API 端点，以及每个端点的示例参数。
 * 自定义路径也允许，但只接受字母、数字和斜杠，防止拼出别的 URL。
 */
const SAMPLE_ADDRESS = { address1: '4529 Winona Court', address2: 'Denver, CO' }
export const ENDPOINTS = [
  { path: 'property/detail', label: 'Property Detail', sample: SAMPLE_ADDRESS },
  { path: 'property/basicprofile', label: 'Basic Profile', sample: SAMPLE_ADDRESS },
  { path: 'property/expandedprofile', label: 'Expanded Profile', sample: SAMPLE_ADDRESS },
  { path: 'property/snapshot', label: 'Snapshot', sample: { postalcode: '82009', page: '1', pagesize: '10' } },
  { path: 'property/address', label: 'Address Lookup', sample: { postalcode: '82009', page: '1', pagesize: '10' } },
  { path: 'assessment/detail', label: 'Assessment Detail', sample: SAMPLE_ADDRESS },
  { path: 'avm/detail', label: 'AVM Detail', sample: SAMPLE_ADDRESS },
  { path: 'sale/detail', label: 'Sale Detail', sample: SAMPLE_ADDRESS },
  { path: 'saleshistory/detail', label: 'Sales History', sample: SAMPLE_ADDRESS },
  { path: 'allevents/detail', label: 'All Events', sample: { id: '184713191' } },
]

const PATH_RE = /^[a-z0-9]+(\/[a-z0-9]+)*$/i
const MAX_PARAMS = 20

router.get('/endpoints', (req, res) => {
  res.json({ configured: Boolean(config.attom.apiKey), baseUrl: config.attom.baseUrl, endpoints: ENDPOINTS })
})

router.post('/query', async (req, res) => {
  const endpoint = String(req.body?.endpoint ?? '').trim().replace(/^\/+|\/+$/g, '')
  const raw = req.body?.params ?? {}

  if (!PATH_RE.test(endpoint)) {
    return res.status(400).json({ ok: false, message: '端点路径不合法，例如 property/detail' })
  }
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    return res.status(400).json({ ok: false, message: 'params 需为对象' })
  }
  // 去掉空值，统一转成字符串
  const params = Object.fromEntries(
    Object.entries(raw)
      .map(([k, v]) => [String(k).trim(), String(v ?? '').trim()])
      .filter(([k, v]) => k && v)
      .slice(0, MAX_PARAMS),
  )

  if (!config.attom.apiKey) {
    return res.status(503).json({ ok: false, error: 'not_configured', message: '缺少 ATTOM_API_KEY，请在 .env 中配置' })
  }

  const url = `${config.attom.baseUrl}/${endpoint}?${new URLSearchParams(params)}`
  const started = Date.now()
  let httpStatus = null
  let body = null

  try {
    const upstream = await fetch(url, {
      headers: { apikey: config.attom.apiKey, accept: 'application/json' },
      signal: AbortSignal.timeout(config.attom.timeoutMs),
    })
    httpStatus = upstream.status
    const text = await upstream.text()
    try {
      body = JSON.parse(text)
    } catch {
      body = { raw: text }
    }
  } catch (err) {
    console.error('[property] 上游请求失败:', err.message)
    body = { error: err.name === 'TimeoutError' ? 'timeout' : 'network_error', message: err.message }
  }

  const durationMs = Date.now() - started
  // ATTOM 查无结果时也会回 400 + status.msg，照样入库，便于排查
  let stored = null
  try {
    stored = saveResult({ endpoint, params, httpStatus, body, durationMs })
  } catch (err) {
    console.error('[property] 写入数据库失败:', err.message)
  }

  res.status(httpStatus == null ? 502 : 200).json({
    ok: httpStatus != null && httpStatus < 400,
    endpoint,
    params,
    httpStatus,
    durationMs,
    requestId: stored?.requestId ?? null,
    savedProperties: stored?.saved ?? 0,
    data: body,
  })
})

router.get('/history', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200)
  res.json({ items: listRequests(limit) })
})

router.get('/history/:id', (req, res) => {
  const row = getRequest(Number(req.params.id))
  if (!row) return res.status(404).json({ ok: false, message: '记录不存在' })
  res.json(row)
})

router.get('/properties', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 100, 500)
  res.json({ items: listProperties(limit) })
})

export default router
