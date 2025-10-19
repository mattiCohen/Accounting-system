import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',   // <-- important for Electron
  plugins: [react()],
  server: {
    port: 3333,
    strictPort: true,
  },
})
