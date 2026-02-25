import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://decisiondevbackend.vercel.app',
        changeOrigin: true,
      },
    },
  },
});
console.log("Forcing Vite Restart for Tailwind Dark mode");
