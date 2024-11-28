package com.gestcom.gestcom.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gestcom.gestcom.dto.CategoriaDTO;
import com.gestcom.gestcom.model.Categoria;
import com.gestcom.gestcom.repository.CategoriaRepository;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private CategoriaService categoriaService;

    private CategoriaDTO categoriaDTO;
    private Categoria categoria;
    private Long usuarioId;

    @BeforeEach
    void setUp() {
        usuarioId = 1L;
        
        categoriaDTO = new CategoriaDTO();
        categoriaDTO.setId(1L);
        categoriaDTO.setNome("Categoria Teste");
        categoriaDTO.setDescricao("Descrição Teste");
        categoriaDTO.setUsuarioId(usuarioId);

        categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNome("Categoria Teste");
        categoria.setDescricao("Descrição Teste");
        categoria.setUsuarioId(usuarioId);
    }

    @Test
    void save_DeveRetornarCategoriaDTOSalva() {
        categoriaDTO.setId(null);
        
        Categoria categoriaSalva = new Categoria();
        categoriaSalva.setId(1L);
        categoriaSalva.setNome(categoriaDTO.getNome());
        categoriaSalva.setDescricao(categoriaDTO.getDescricao());
        categoriaSalva.setUsuarioId(usuarioId);

        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoriaSalva);

        CategoriaDTO resultado = categoriaService.save(categoriaDTO, usuarioId);

        assertNotNull(resultado);
        assertEquals(categoriaSalva.getId(), resultado.getId());
        assertEquals(categoriaSalva.getNome(), resultado.getNome());
        assertEquals(categoriaSalva.getDescricao(), resultado.getDescricao());
        assertEquals(usuarioId, resultado.getUsuarioId());
        verify(categoriaRepository).save(any(Categoria.class));
    }

    @Test
    void findById_DeveRetornarCategoriaDTO() {
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));

        CategoriaDTO resultado = categoriaService.findById(1L);

        assertNotNull(resultado);
        assertEquals(categoria.getId(), resultado.getId());
        assertEquals(categoria.getNome(), resultado.getNome());
        assertEquals(categoria.getDescricao(), resultado.getDescricao());
        verify(categoriaRepository).findById(1L);
    }

    @Test
    void findAllByUsuarioId_DeveRetornarListaDeCategorias() {
        List<Categoria> categorias = Arrays.asList(categoria);
        when(categoriaRepository.findByUsuarioId(usuarioId)).thenReturn(categorias);

        List<CategoriaDTO> resultado = categoriaService.findAllByUsuarioId(usuarioId);

        assertNotNull(resultado);
        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
        assertEquals(categoria.getId(), resultado.get(0).getId());
        assertEquals(categoria.getNome(), resultado.get(0).getNome());
        assertEquals(categoria.getDescricao(), resultado.get(0).getDescricao());
        verify(categoriaRepository).findByUsuarioId(usuarioId);
    }

    @Test
    void update_DeveAtualizarERetornarCategoriaDTO() {
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoria);

        CategoriaDTO novaCategoria = new CategoriaDTO();
        novaCategoria.setId(1L);
        novaCategoria.setNome("Categoria Atualizada");
        novaCategoria.setDescricao("Descrição Atualizada");
        novaCategoria.setUsuarioId(usuarioId);

        CategoriaDTO resultado = categoriaService.update(novaCategoria);

        assertNotNull(resultado);
        assertEquals(novaCategoria.getNome(), resultado.getNome());
        assertEquals(novaCategoria.getDescricao(), resultado.getDescricao());
        verify(categoriaRepository).findById(1L);
        verify(categoriaRepository).save(any(Categoria.class));
    }

    @Test
    void deleteById_DeveDeletarCategoria() {
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        doNothing().when(categoriaRepository).deleteById(1L);

        categoriaService.deleteById(1L);

        verify(categoriaRepository).findById(1L);
        verify(categoriaRepository).deleteById(1L);
    }

    @Test
    void findById_DeveLancarExcecao_QuandoCategoriaNaoExistir() {
        when(categoriaRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> categoriaService.findById(1L));
        verify(categoriaRepository).findById(1L);
    }

    @Test
    void save_DeveLancarExcecao_QuandoNomeDuplicadoParaUsuario() {
        when(categoriaRepository.save(any(Categoria.class)))
            .thenThrow(new IllegalArgumentException("Erro ao salvar categoria: nome já existe para este usuário"));

        assertThrows(IllegalArgumentException.class, 
            () -> categoriaService.save(categoriaDTO, usuarioId));
    }
}