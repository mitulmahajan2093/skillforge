import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In dev, the Next.js blog runs on its own server (npm run dev in
      // blog/, port 3000) with basePath "/blog" already baked in. Proxying
      // it through here means http://localhost:5173/blog works exactly
      // like production, where both apps are served from one domain.
      '/blog': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
      // Next.js dev mode serves HMR/static assets from /_next — these need
      // to go to the same place even though they aren't under /blog.
      '/_next': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
