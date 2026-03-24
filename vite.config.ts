import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Base '/' memastikan path aset (JS/CSS) selalu absolut dari root
    base: '/',
    plugins: [react(), tailwindcss()],
    define: {
      // Gunakan stringify untuk memastikan variabel terdefinisi dengan benar
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || env.SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY),
    },
    resolve: {
      alias: {
        // Gunakan path.resolve yang lebih aman untuk struktur project
        '@': path.resolve(__dirname, './src'), 
      },
    },
    build: {
      // Memastikan output bersih dan terorganisir
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});