import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/bins': 'http://localhost:3000',
      '/in': 'http://localhost:3000',
    }
  }
})
