import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BASE_URL = "/";

export default defineConfig({
  plugins: [react()],
  base: BASE_URL,
  build: { outDir: "./public", emptyOutDir: true }
})