import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base path for GitHub Pages deployment
  // Custom domain: https://react-demo.inapppai.com -> base: '/'
  // GitHub Pages: https://username.github.io/react -> base: '/react'
  base: process.env.VITE_BASE_PATH || '/',
  publicDir: 'public',
  resolve: {
    // Force React 19 for all dependencies to prevent dual React instances
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5173,
    open: true,
  },
})
