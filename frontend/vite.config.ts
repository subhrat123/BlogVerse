import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // your frontend port
    proxy: {
      // Proxy all requests starting with /api to your backend
      '/api': {
        target: 'https://blogverse.subhrat.workers.dev', // your backend port
        changeOrigin: true,
        secure: false, // only for HTTP dev
        // rewrite path if needed
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
