import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  build: {
    outDir: path.resolve(__dirname, '../../RicoServer/front'),
    emptyOutDir: true, // Clears the folder before building
  }
})
