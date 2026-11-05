import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
process.env.VITE_SITE_URL ??= vercelUrl
  ? `https://${vercelUrl}`
  : 'http://localhost:5173';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
