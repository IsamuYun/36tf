import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API_TARGET = process.env.API_TARGET || 'http://localhost:3001'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5188,
    // 把 /api 转给独立的 Express 服务。前端代码里始终用同源相对路径，
    // 既避开开发期跨域，也让生产部署可以直接由网关按路径分流。
    proxy: {
      '/api': {
        target: API_TARGET,
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
})
