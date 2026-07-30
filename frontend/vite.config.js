import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',   // your backend URL (no trailing slash)
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // remove /api prefix if needed
      }
    }
  }
})
