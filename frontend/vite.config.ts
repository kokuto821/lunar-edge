import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // パスエイリアス: @/ → src/
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // /api/* へのリクエストをバックエンド (FastAPI) に転送する
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
  },
});
