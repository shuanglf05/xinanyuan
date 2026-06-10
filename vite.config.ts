import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/xinanyuan/', 
  build: {
    emptyOutDir: true //
  }
});
