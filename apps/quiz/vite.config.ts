import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // The docs site owns the domain root; the demo is published one level down.
  base: '/quiz/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
