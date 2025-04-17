// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/nap-auth.js',
      name: 'NapAuth',
      fileName: 'nap-auth',
      formats: ['es'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [], 
      output: {
        globals: {}
      }
    }
  }
});
