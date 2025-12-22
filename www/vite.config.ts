import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [viteSingleFile(), tailwindcss()],
  server: {
    port: 5173,
    host: 'localhost'
  },
  build: {
    outDir: 'Distribution',
    assetsInlineLimit: 0, // Ensure fonts are properly handled
  },
  assetsInclude: ['**/*.ttf', '**/*.otf', '**/*.woff', '**/*.woff2']
})