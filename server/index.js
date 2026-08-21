import express from 'express'
import cors from 'cors'
import { config, missingEnv, missingMailEnv, configSummary } from './config.js'
import chatRouter from './routes/chat.js'
import contactRouter from './routes/contact.js'

const app = express()

app.use(
  cors({
    origin: config.corsOrigins,
    methods: ['GET', 'POST'],
  }),
)
app.use(express.json({ limit: '256kb' }))

// 健康检查：报告服务在线与配置是否齐全，不泄露任何密钥
app.get('/api/health', (req, res) => {
  const missing = missingEnv()
  res.json({
    ok: true,
    chat: { configured: missing.length === 0, missing, model: config.qwen.model || null },
    contact: { configured: missingMailEnv().length === 0, missing: missingMailEnv() },
  })
})

app.use('/api/chat', chatRouter)
app.use('/api/contact', contactRouter)

// 兜底错误处理，避免异常直接把进程带崩
app.use((err, req, res, next) => {
  console.error('[server] 未捕获错误:', err)
  if (res.headersSent) return next(err)
  res.status(500).json({ error: 'internal_error', message: '服务内部错误' })
})

app.listen(config.port, config.host, () => {
  const s = configSummary()
  console.log(`\n  36 Tech API  →  http://${config.host}:${s.port}`)
  console.log(`  模型      ${s.model}`)
  console.log(`  端点      ${s.baseUrl}`)
  console.log(`  密钥      ${s.apiKey}`)
  const missing = missingEnv()
  if (missing.length) {
    console.warn(`\n  ⚠ 缺少 ${missing.join('、')}，聊天接口将返回 503`)
  }
  const mailMissing = missingMailEnv()
  if (mailMissing.length) {
    console.warn(`  ⚠ 缺少 ${mailMissing.join('、')}，联系表单将返回 503`)
  }
  console.log('')
})
