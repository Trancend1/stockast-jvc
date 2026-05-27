import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'server-only': path.resolve(__dirname, 'tests/mocks/server-only.ts'),
    },
  },
  cacheDir: '.vite-cache',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts', './tests/integration/setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}', 'src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/rules/**', 'src/lib/services/**'],
    },
  },
});
