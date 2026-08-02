import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // `joshuavandaalen.github.io` is a user Pages site, served from the domain
  // root — so no base path. The 90s site is copied alongside at /retro at
  // deploy time.
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
