import { crx } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';

import manifest from './public/manifest.json';

export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: 'src/background.ts',
        content: 'src/content/index.ts',
        popup: 'src/popup/popup.html',
      },
      output: {
        entryFileNames: '[name].js',
      },
    },

    minify: false,
    sourcemap: true,
  },
});
