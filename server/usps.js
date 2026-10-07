import { config } from './config.js'

/**
 * USPS 包裹追踪。走 apis.usps.com 的 REST 接口：
 * 先用 Consumer Key / Secret 换 OAuth token（有效期约 8 小时，内存里缓存），
 * 再查 Tracking v3（GET /tracking/v3/tracking/{单号}）。
 */

let cached = null // { token, expiresAt }

async function getToken() {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token
  const res = await fetch(`${config.usps.baseUrl}/oauth2/v3/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: config.usps.consumerKey,
      client_secret: config.usps.consumerSecret,
    }),
    signal: AbortSignal.timeout(config.usps.timeoutMs),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || !body.access_token) {
    const err = new Error(`USPS 鉴权失败（${res.status}）：${body.error_description || body.error || '未知错误'}`)
    err.status = 502
    throw err
  }
  cached = {
    token: body.access_token,
    expiresAt: Date.now() + (Number(body.expires_in) || 3600) * 1000,
  }
  return cached.token
}

async function call(path, init = {}) {
  const token = await getToken()
  const res = await fetch(`${config.usps.baseUrl}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${token}`, accept: 'application/json', ...init.headers },
    signal: AbortSignal.timeout(config.usps.timeoutMs),
  })
  // token 被提前吊销时清掉缓存，下一次请求会重新换
  if (res.status === 401) cached = null
  const text = await res.text()
  let body
  try {
    body = JSON.parse(text)
  } catch {
    body = { raw: text.slice(0, 2000) }
  }
  return { status: res.status, body }
}

/** USPS 的错误报文：{ error: { code, message, errors: [{ detail }] } } */
function errorMessage(body) {
  const e = body?.error
  if (!e) return body?.raw || '未知错误'
  if (typeof e === 'string') return body.error_description || e
  return e.errors?.[0]?.detail || e.message || e.code || '未知错误'
}

const pick = (...vals) => vals.find((v) => v !== undefined && v !== null && v !== '') ?? null

function normalizeEvent(ev) {
  return {
    type: pick(ev.eventType, ev.event),
    code: pick(ev.eventCode),
    time: pick(ev.eventTimestamp, ev.GMTTimestamp, ev.eventDate),
    city: pick(ev.eventCity),
    state: pick(ev.eventState),
    zip: pick(ev.eventZIP, ev.eventZIPCode),
    country: pick(ev.eventCountry),
  }
}

/** 把 v3 报文压成前端用的结构；原始报文另外带上，便于对照 */
function normalize(data, version) {
  const t = Array.isArray(data) ? data[0] : data
  return {
    version,
    trackingNumber: pick(t?.trackingNumber),
    status: pick(t?.status, t?.statusCategory),
    statusCategory: pick(t?.statusCategory),
    summary: pick(t?.statusSummary),
    mailClass: pick(t?.mailClass),
    origin: [t?.originCity, t?.originState, t?.originZIP].filter(Boolean).join(', ') || null,
    destination: [t?.destinationCity, t?.destinationState, t?.destinationZIP].filter(Boolean).join(', ') || null,
    expectedDelivery: pick(t?.expectedDeliveryDate, t?.expectedDeliveryTimeStamp, t?.guaranteedDeliveryDate),
    events: (t?.trackingEvents ?? []).map(normalizeEvent),
    raw: data,
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * @param {string} trackingNumber
 * @param {{ mailingDate?: string, destinationZIPCode?: string }} [extra] 可选，单号重复时用来区分
 */
export async function track(trackingNumber, extra = {}) {
  const qs = new URLSearchParams({ expand: 'DETAIL' })
  if (extra.mailingDate) qs.set('mailingDate', extra.mailingDate)
  if (extra.destinationZIPCode) qs.set('destinationZIPCode', extra.destinationZIPCode)
  const path = `/tracking/v3/tracking/${encodeURIComponent(trackingNumber)}?${qs}`

  let r = await call(path)
  // USPS 网关会间歇性回纯文本的「503 Not found」，稍等重试一次
  if (r.status === 503) {
    await sleep(1500)
    r = await call(path)
  }
  if (r.status < 400) return normalize(r.body, 'v3')

  // 查无此件时 v3 回的是 400，报文里带 “Tracking is not available”
  if (r.status === 404 || /not available/i.test(errorMessage(r.body))) {
    throw Object.assign(new Error('查不到这个单号：可能单号有误，或 USPS 还没收到/扫描该邮件。'), { status: 404 })
  }
  const status = r.status === 400 ? 400 : 502
  throw Object.assign(new Error(`USPS 查询失败（${r.status}）：${errorMessage(r.body)}`), { status })
}
