import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 5173,
    strictPort: false, // 如果端口被占用，自动尝试下一个
    open: false, // 不自动打开浏览器
    cors: true, // 启用CORS
    hmr: {
      overlay: true // 显示错误覆盖层
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // 生成sourcemap便于调试
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  },
  define: {
    'process.env': {}
  }
});