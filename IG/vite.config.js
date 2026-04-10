import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: {
    alias: {
      docs: path.resolve(__dirname, './docs'),
    },
  },
  plugins: [react(), tailwindcss()],
})
