import { Router } from 'express'
import nodemailer from 'nodemailer'
import { config, missingMailEnv } from '../config.js'

const router = Router()

const MAX = { name: 80, email: 160, message: 4000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** 极简内存限流：同一 IP 每 10 分钟最多 5 次 */
const hits = new Map()
const WINDOW_MS = 10 * 60 * 1000
const MAX_HITS = 5

function rateLimited(ip) {
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (list.length >= MAX_HITS) return true
  list.push(now)
  hits.set(ip, list)
  // 顺手清理过期项，避免 Map 无限增长
  if (hits.size > 500) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k)
  }
  return false
}

let transporter = null
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.port === 465,
      auth: { user: config.mail.user, pass: config.mail.pass },
    })
  }
  return transporter
}

router.post('/', async (req, res) => {
  const { name = '', email = '', message = '', company = '' } = req.body ?? {}

  // 蜜罐命中：真实用户看不到这个字段。静默返回成功，不给机器人任何反馈信号。
  if (String(company).trim()) {
    console.warn('[contact] 蜜罐命中，已丢弃')
    return res.json({ ok: true })
  }

  const n = String(name).trim().slice(0, MAX.name)
  const e = String(email).trim().slice(0, MAX.email)
  const m = String(message).trim().slice(0, MAX.message)

  if (!n || !e || !m) {
    return res.status(400).json({ ok: false, message: '请填写姓名、邮箱和留言。' })
  }
  if (!EMAIL_RE.test(e)) {
    return res.status(400).json({ ok: false, message: '邮箱格式看起来不对，检查一下？' })
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, message: '提交过于频繁，请稍后再试。' })
  }

  const missing = missingMailEnv()
  if (missing.length) {
    console.warn(`[contact] 邮件未配置，缺少：${missing.join('、')}`)
    return res.status(503).json({
      ok: false,
      error: 'not_configured',
      message: `邮件服务尚未配置（缺少 ${missing.join('、')}），请直接发邮件到 ${config.mail.to || 'yun@36tech.info'}。`,
    })
  }

  try {
    await getTransporter().sendMail({
      from: config.mail.from,
      to: config.mail.to,
      replyTo: e, // 直接点回复就能回到访客邮箱
      subject: `官网留言 · ${n}`,
      text: `姓名：${n}\n邮箱：${e}\n\n留言：\n${m}\n\n—— 来自 36 Tech 官网联系表单`,
    })
    console.log(`[contact] 已发送，来自 ${n} <${e}>`)
    res.json({ ok: true })
  } catch (err) {
    console.error('[contact] 发送失败:', err.message)
    res.status(502).json({
      ok: false,
      message: `发送失败，请直接发邮件到 ${config.mail.to}。`,
    })
  }
})

export default router
