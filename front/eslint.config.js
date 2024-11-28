import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // Ignora a pasta dist (arquivos buildados)
  { ignores: ['dist'] },
  {
    // Define quais arquivos serão analisados (JavaScript e JSX)
    files: ['**/*.{js,jsx}'],
    
    languageOptions: {
      // Define a versão do ECMAScript (JavaScript moderno)
      ecmaVersion: 2020,
      // Adiciona variáveis globais do navegador
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        // Habilita suporte a JSX
        ecmaFeatures: { jsx: true },
        // Permite uso de import/export
        sourceType: 'module',
      },
    },

    // Configurações específicas para React
    settings: { react: { version: '18.3' } },

    // Plugins que adicionam regras específicas
    plugins: {
      react,                    // Regras para React
      'react-hooks': reactHooks,// Regras para Hooks do React
      'react-refresh': reactRefresh, // Regras para React Refresh
    },

    // Conjunto de regras ativas
    rules: {
      ...js.configs.recommended.rules,           // Regras JavaScript básicas
      ...react.configs.recommended.rules,        // Regras React recomendadas
      ...react.configs['jsx-runtime'].rules,     // Regras para JSX
      ...reactHooks.configs.recommended.rules,   // Regras para Hooks
      'react/jsx-no-target-blank': 'off',        // Desativa regra específica
      'react-refresh/only-export-components': [   // Configura regra específica
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
