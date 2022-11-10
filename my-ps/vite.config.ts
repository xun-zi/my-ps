import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const src = normalizePath(path.resolve('./src'));
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {

      }
    }
  },
  resolve: {
    alias: {
      '@': src,
    }
  }
})
