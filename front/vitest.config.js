import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',     // Simula um ambiente de navegador
    globals: true,            // Permite variáveis globais nos testes
    setupFiles: './src/test/setup.js', // Arquivo de configuração inicial dos testes
  },
}) 