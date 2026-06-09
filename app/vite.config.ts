import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Project GitHub Pages serve under /<repo>/; local dev stays at root.
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/trustabl-web/' : '/',
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
}))
