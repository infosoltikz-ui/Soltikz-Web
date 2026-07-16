import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':            resolve(__dirname, './src'),
      '@components':  resolve(__dirname, './src/components'),
      '@features':    resolve(__dirname, './src/features'),
      '@hooks':       resolve(__dirname, './src/hooks'),
      '@layouts':     resolve(__dirname, './src/layouts'),
      '@lib':         resolve(__dirname, './src/lib'),
      '@providers':   resolve(__dirname, './src/providers/index.tsx'),
      '@routes':      resolve(__dirname, './src/routes/index.tsx'),
      '@services':    resolve(__dirname, './src/services'),
      '@store':       resolve(__dirname, './src/store'),
      '@styles':      resolve(__dirname, './src/styles'),
      '@utils':       resolve(__dirname, './src/utils'),
      '@constants':   resolve(__dirname, './src/constants/index.ts'),
      '@config':      resolve(__dirname, './src/config'),
      '@assets':      resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:  ['react', 'react-dom'],
          router:  ['react-router-dom'],
          motion:  ['framer-motion'],
          query:   ['@tanstack/react-query'],
          icons:   ['lucide-react'],
        },
      },
    },
  },
})
