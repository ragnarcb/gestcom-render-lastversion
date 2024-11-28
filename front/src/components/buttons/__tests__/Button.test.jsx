import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from '../Button'

describe('Button Component', () => {
  it('renderiza o botão com o texto correto', () => {
    render(<Button text="Teste" />)
    expect(screen.getByText('Teste')).toBeInTheDocument()
  })

  it('chama a função onClick quando clicado', () => {
    const handleClick = vi.fn()
    render(<Button text="Clique" onClick={handleClick} />)
    
    fireEvent.click(screen.getByText('Clique'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('aplica os estilos customizados corretamente', () => {
    render(
      <Button 
        text="Estilizado"
        backgroundColor="#ff0000"
        color="#ffffff"
      />
    )
    const button = screen.getByText('Estilizado')
    expect(button).toHaveStyle({
      backgroundColor: '#ff0000',
      color: '#ffffff'
    })
  })
}) 