import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or your specific framework plugin

export default defineConfig({
  plugins: [react()],
})