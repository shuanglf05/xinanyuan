import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      usePolling: false,
      followSymlinks: false,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/Library/**',
        '**/Desktop/**',
        '**/Documents/**',
        '**/Downloads/**',
        '**/Movies/**',
        '**/Music/**',
        '**/Pictures/**',
        '**/Public/**',
        '**/.trae/**',
        '**/.trae-cn/**',
        '**/.agents/**',
        '**/.ai_completion/**',
        '**/.nvm/**',
        '**/.npm/**',
        '**/.cups/**',
      ],
    },
  },
})
