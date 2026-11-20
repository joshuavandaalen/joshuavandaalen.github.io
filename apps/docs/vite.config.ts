import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // Served at the domain root of the user Pages site.
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
