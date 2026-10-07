import { Router } from 'express'
import { config } from '../config.js'
import { track } from '../usps.js'

const router = Router()

const configured = () => Boolean(config.usps.consumerKey && config.usps.consumerSecret)

router.get('/meta', (req, res) => {
  res.json({ ok: true, configured: configured() })
})

// GET /api/usps/track/:id?mailingDate=YYYY-MM-DD&zip=12345
router.get('/track/:id', async (req, res) => {
  if (!configured()) {
    return res.status(503).json({
      error: 'not_configured',
      message: '尚未配置 USPS_CONSUMER_KEY / USPS_CONSUMER_SECRET。请在 .env 中填写后重启 API 服务。',
    })
  }

  // 用户常带空格或连字符粘贴单号
  const id = String(req.params.id).replace(/[\s-]/g, '').toUpperCase()
  if (!/^[A-Z0-9]{10,40}$/.test(id)) {
    return res.status(400).json({ error: 'bad_request', message: '单号格式不对：应为 10–40 位字母或数字' })
  }
  const mailingDate = /^\d{4}-\d{2}-\d{2}$/.test(req.query.mailingDate ?? '') ? req.query.mailingDate : undefined
  const destinationZIPCode = /^\d{5}$/.test(req.query.zip ?? '') ? req.query.zip : undefined

  try {
    res.json({ ok: true, result: await track(id, { mailingDate, destinationZIPCode }) })
  } catch (err) {
    console.error('[usps] 查询失败:', err.message)
    const isTimeout = err.name === 'TimeoutError'
    res.status(isTimeout ? 504 : err.status || 502).json({
      error: 'usps_error',
      message: isTimeout ? 'USPS 响应超时，请重试。' : err.message,
    })
  }
})

export default router
