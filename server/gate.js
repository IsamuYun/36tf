import crypto from 'node:crypto'
import { config } from './config.js'

/**
 * CRESpan Demo 的门禁。
 *
 * 两道开关，都在 .env 里：
 *   CRESPAN_ENABLED=false   整个 Demo 下线，谁都进不去，页面只剩一句说明
 *   CRESPAN_ACCESS_CODE=xx  设了就要凭访问码进入；留空表示不设门禁
 *
 * 通行凭证是一枚 HttpOnly cookie，值为访问码的 HMAC，不是码本身——
 * 拿到 cookie 也反推不出码。换码即所有已发出的 cookie 同时失效，
 * 不需要另外维护会话表，这正是「想收回就换个码」要的效果。
 */

const COOKIE = 'crespan_pass'

/**
 * 当前访问码对应的凭证值：以访问码为密钥做 HMAC。
 * 不掺随机盐，重启和重新部署都不会把已放行的人挡在门外；
 * 但凡换了码，旧凭证立刻对不上。
 */
function expectedToken() {
  return crypto.createHmac('sha256', config.crespan.accessCode).update('crespan-pass-v1').digest('hex')
}

/** 只解出我们关心的那一个 cookie，不引第三方解析库 */
function readCookie(req, name) {
  const raw = req.headers.cookie
  if (!raw) return null
  for (const part of raw.split(';')) {
    const i = part.indexOf('=')
    if (i === -1) continue
    if (part.slice(0, i).trim() !== name) continue
    return decodeURIComponent(part.slice(i + 1).trim())
  }
  return null
}

/** 等长比较，避免逐字符比较泄露信息 */
function safeEqual(a, b) {
  const x = Buffer.from(String(a))
  const y = Buffer.from(String(b))
  if (x.length !== y.length) return false
  return crypto.timingSafeEqual(x, y)
}

/** @returns {{ enabled: boolean, required: boolean, unlocked: boolean }} */
export function gateStatus(req) {
  const { enabled, accessCode } = config.crespan
  const required = Boolean(accessCode)
  if (!enabled) return { enabled: false, required, unlocked: false }
  if (!required) return { enabled: true, required: false, unlocked: true }
  const token = readCookie(req, COOKIE)
  return { enabled: true, required: true, unlocked: Boolean(token) && safeEqual(token, expectedToken()) }
}

function setCookie(req, res, value, maxAgeSec) {
  // 站点走 Nginx 反代时 req.protocol 恒为 http，真实协议看 X-Forwarded-Proto
  const https = req.headers['x-forwarded-proto'] === 'https' || req.protocol === 'https'
  const bits = [
    `${COOKIE}=${value}`,
    'Path=/',
    `Max-Age=${maxAgeSec}`,
    'HttpOnly',
    'SameSite=Lax',
    https ? 'Secure' : null,
  ].filter(Boolean)
  res.append('Set-Cookie', bits.join('; '))
}

/** 校验访问码；对了就发通行 cookie */
export function unlock(req, res, code) {
  const { enabled, accessCode } = config.crespan
  if (!enabled) return false
  if (!accessCode) return true
  if (!code || !safeEqual(String(code).trim(), accessCode)) return false
  setCookie(req, res, expectedToken(), config.crespan.sessionDays * 86400)
  return true
}

/** 交还通行证：同名 cookie 置空并立即过期 */
export function lock(req, res) {
  setCookie(req, res, '', 0)
}

/**
 * 试错限速：同一 IP 十分钟内最多 10 次。
 * 进程内计数即可——Demo 只有一个实例，不值得为此引 Redis。
 */
const WINDOW_MS = 10 * 60 * 1000
const MAX_TRIES = 10
const tries = new Map()

export function rateLimited(ip) {
  const now = Date.now()
  const rec = tries.get(ip)
  if (!rec || now > rec.resetAt) {
    tries.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  rec.count++
  // 顺手清掉过期的记录，避免 Map 无限增长
  if (tries.size > 500) {
    for (const [k, v] of tries) if (now > v.resetAt) tries.delete(k)
  }
  return rec.count > MAX_TRIES
}

export function clearAttempts(ip) {
  tries.delete(ip)
}

/** 挡在需要鉴权的接口前面 */
export function requireAccess(req, res, next) {
  const gate = gateStatus(req)
  if (!gate.enabled) {
    return res.status(503).json({ error: 'disabled', message: 'Demo 暂未开放。' })
  }
  if (!gate.unlocked) {
    return res.status(401).json({ error: 'locked', message: '需要访问码才能使用。' })
  }
  next()
}
