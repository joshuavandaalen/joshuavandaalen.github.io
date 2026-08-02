import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Ships `tokens.css` as its own entry point alongside the bundled `styles.css`.
 *
 * Consumers who only want the design tokens — to build their own components on
 * the same palette, bevels and motion scale — should not have to download every
 * component rule to get them.
 */
function emitTokensStylesheet(): Plugin {
  return {
    name: 'retro-ui:emit-tokens-stylesheet',
    apply: 'build',
    closeBundle() {
      const outDir = resolve(here, 'dist');
      mkdirSync(outDir, { recursive: true });
      copyFileSync(
        resolve(here, 'src/styles/tokens.css'),
        resolve(outDir, 'tokens.css'),
      );
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx', 'src/**/*.test.ts'],
      insertTypesEntry: true,
    }),
    emitTokensStylesheet(),
  ],
  build: {
    lib: {
      entry: resolve(here, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        // Every component's CSS collapses into one predictable stylesheet so the
        // exports map can point at `./styles.css` regardless of build internals.
        assetFileNames: (asset) =>
          asset.names?.some((name) => name.endsWith('.css'))
            ? 'styles.css'
            : '[name][extname]',
      },
    },
  },
});
