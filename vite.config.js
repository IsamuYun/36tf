import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // 读不带 VITE_ 前缀的变量（第三个参数传空前缀），让开发代理跟随 .env 里的 PORT。
  // 端口的唯一来源是 .env，改那一处即可，不需要再动这里。
  const env = loadEnv(mode, process.cwd(), '')
  const apiPort = env.PORT || '3100'
  const apiTarget = env.API_TARGET || `http://127.0.0.1:${apiPort}`

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: Number(env.WEB_PORT) || 5188,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          // SSE 需要关闭缓冲，否则流式输出会被攒住
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              if (proxyRes.headers['content-type']?.includes('text/event-stream')) {
                proxyRes.headers['cache-control'] = 'no-cache, no-transform'
              }
            })
          },
        },
      },
    },
  }
})
