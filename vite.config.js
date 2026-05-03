import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          /* Vendor chunk: React + Router cached separately from page code */
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});