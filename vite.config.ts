import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  // Tự động kiểm tra nếu đang build trên GitHub Actions thì lấy base là /quanlimatkhau1/
  const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

  return {
    base: isGithubPages ? '/quanlimatkhau1/' : '/',
    plugins: [
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
