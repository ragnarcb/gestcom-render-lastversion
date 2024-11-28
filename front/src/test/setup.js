import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import React from 'react'

// Limpa após cada teste
afterEach(() => {
  cleanup()
})

// Define variáveis globais para os testes
global.React = React
global.vi = vi