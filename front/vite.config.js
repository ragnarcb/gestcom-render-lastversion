import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Configuração dos plugins
  plugins: [react()], // Adiciona suporte ao React

  // Configuração do servidor de desenvolvimento
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8089',  // URL do servidor backend
        changeOrigin: true,               // Permite mudança de origem nas requisições
        rewrite: (path) => path.replace(/^\/api/, '')  // Remove '/api' das requisições
      }
    }
  },

  // Define o caminho base da aplicação
  base: '/',

  // Configurações de build (produção)
  build: {
    sourcemap: true,    // Gera source maps para debug
    outDir: 'dist',     // Diretório onde os arquivos buildados serão salvos
    assetsDir: 'assets', // Subdiretório para assets (imagens, fontes, etc)

    // Configurações do Rollup (bundler)
    rollupOptions: {
      output: {
        manualChunks: undefined  // Desativa divisão manual de chunks
      }
    }
  }
})