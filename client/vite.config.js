import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://devsecure-analyzer-1-0-0.onrender.com',
        changeOrigin: true,
      }
    }
  }
});