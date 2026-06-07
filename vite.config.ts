import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Minden /api hívás a gateway-re megy.
      // Így nem kell CORS-szal bajlódni dev-ben — a böngésző szempontjából
      // same-origin a hívás (5173 → 5173 → proxyzva 8080-ra).
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
