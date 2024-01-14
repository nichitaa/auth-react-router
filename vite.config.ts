/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { copyFileSync } from 'node:fs';

const OUT_DIR = resolve(__dirname, 'dist');

export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      afterBuild: () => {
        const esmTypeDefinitions = resolve(OUT_DIR, 'index.d.ts');
        const cjsTypeDefinitions = resolve(OUT_DIR, 'index.d.cts');
        copyFileSync(esmTypeDefinitions, cjsTypeDefinitions);
      },
    }),
  ],
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'auth-react-router',
      formats: ['es', 'umd'],
      fileName: `index`,
    },
    rollupOptions: {
      external: ['react', 'react-router', 'react-router-dom'],
      output: {
        globals: {
          react: 'React',
          'react-router': 'ReactRouter',
          'react-router-dom': 'ReactRouterDOM',
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts']
  },
});
