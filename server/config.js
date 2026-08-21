import 'dotenv/config'

/**
 * 环境配置的唯一入口。所有读取 process.env 的地方都走这里，
 * 便于集中校验与后续扩展（多模型、多环境）。
 */
const required = ['QWEN_API_KEY', 'QWEN_BASE_URL', 'QWEN_MODEL']

export const config = {
  port: Number(process.env.PORT) || 3100,
  // 默认只绑本机回环：生产环境所有流量走 Nginx 反代，
  // 绑 0.0.0.0 会让该端口直接暴露到公网、绕过反代与 HTTPS。
  host: process.env.HOST || '127.0.0.1',
  // 允许跨源的前端地址。生产环境请收窄到实际域名。
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5188,http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  qwen: {
    apiKey: process.env.QWEN_API_KEY?.trim(),
    // 去掉结尾斜杠，避免拼出 //chat/completions
    baseUrl: process.env.QWEN_BASE_URL?.trim().replace(/\/+$/, ''),
    model: process.env.QWEN_MODEL?.trim(),
    // 上游超时（毫秒），防止请求悬挂
    timeoutMs: Number(process.env.QWEN_TIMEOUT_MS) || 60000,
  },
  // 联系表单的邮件发送。未配置时 /api/contact 返回 503 并引导用户直接发邮件。
  mail: {
    host: process.env.SMTP_HOST?.trim(),
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER?.trim(),
    pass: process.env.SMTP_PASS,
    from: process.env.CONTACT_FROM?.trim() || process.env.SMTP_USER?.trim(),
    to: process.env.CONTACT_TO?.trim(),
  },
}

const requiredMail = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO']

/** @returns {string[]} 缺失的变量名 */
export function missingEnv() {
  return required.filter((k) => !process.env[k]?.trim())
}

/** @returns {string[]} 邮件相关缺失的变量名 */
export function missingMailEnv() {
  return requiredMail.filter((k) => !process.env[k]?.trim())
}

/** 脱敏后的配置摘要，用于启动日志——绝不打印密钥本身 */
export function configSummary() {
  const key = config.qwen.apiKey
  return {
    port: config.port,
    baseUrl: config.qwen.baseUrl || '(未配置)',
    model: config.qwen.model || '(未配置)',
    apiKey: key ? `${key.slice(0, 6)}…${key.slice(-4)}（长度 ${key.length}）` : '(未配置)',
  }
}
