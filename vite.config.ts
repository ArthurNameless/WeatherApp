/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@Components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@Hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@Services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@Types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@Utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@Theme': fileURLToPath(new URL('./src/theme', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/__tests__/setup.ts'],
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    css: true,
  },
})