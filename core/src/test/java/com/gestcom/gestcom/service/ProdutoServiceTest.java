package com.gestcom.gestcom.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gestcom.gestcom.dto.CategoriaDTO;
import com.gestcom.gestcom.dto.CategoriaProdutoDTO;
import com.gestcom.gestcom.dto.ProdutoDTO;
import com.gestcom.gestcom.model.Categoria;
import com.gestcom.gestcom.model.Produto;
import com.gestcom.gestcom.repository.ProdutoRepository;
import com.gestcom.gestcom.utils.ProdutoMapper;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private CategoriaService categoriaService;

    @Mock
    private ProdutoMapper produtoMapper;

    @InjectMocks
    private ProdutoService produtoService;

    private ProdutoDTO produtoDTO;
    private Produto produto;
    private Long usuarioId;
    private byte[] imagem;

    @BeforeEach
    void setUp() {
        usuarioId = 1L;
        imagem = "imagem-teste".getBytes();
        
        CategoriaProdutoDTO categoriaDTO = new CategoriaProdutoDTO();
        categoriaDTO.setId(1L);
        categoriaDTO.setNome("Categoria Teste");
        categoriaDTO.setDescricao("Descrição da Categoria");

        produtoDTO = new ProdutoDTO();
        produtoDTO.setId(1L);
        produtoDTO.setNome("Produto Teste");
        produtoDTO.setDescricao("Descrição do Produto");
        produtoDTO.setPreco(100.0);
        produtoDTO.setQuantidade(10);
        produtoDTO.setCategoria(categoriaDTO);
        produtoDTO.setCodigoBarras("123456789");
        produtoDTO.setImagem(imagem);
        produtoDTO.setUsuarioId(usuarioId);

        Categoria categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNome("Categoria Teste");
        categoria.setDescricao("Descrição da Categoria");
        categoria.setUsuarioId(usuarioId);

        produto = new Produto();
        produto.setId(1L);
        produto.setNome("Produto Teste");
        produto.setDescricao("Descrição do Produto");
        produto.setPreco(100.0);
        produto.setQuantidade(10);
        produto.setCategoria(categoria);
        produto.setCodigoBarras("123456789");
        produto.setImagem(imagem);
        produto.setUsuarioId(usuarioId);
    }

    @Test
    void save_DeveSalvarProdutoComSucesso() {
        when(produtoRepository.save(any(Produto.class))).thenReturn(produto);
        
        ProdutoDTO resultado = produtoService.save(produtoDTO, usuarioId);
        
        assertNotNull(resultado);
        assertEquals(produtoDTO.getNome(), resultado.getNome());
        assertEquals(produtoDTO.getPreco(), resultado.getPreco());
        assertEquals(produtoDTO.getQuantidade(), resultado.getQuantidade());
        verify(produtoRepository).save(any(Produto.class));
    }

    @Test
    void findById_DeveRetornarProduto() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        
        ProdutoDTO resultado = produtoService.findById(1L);
        
        assertNotNull(resultado);
        assertEquals(produto.getNome(), resultado.getNome());
        assertEquals(produto.getPreco(), resultado.getPreco());
    }

    @Test
    void findById_DeveLancarExcecao_QuandoProdutoNaoExistir() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> produtoService.findById(1L));
    }

    @Test
    void update_DeveAtualizarProduto() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        when(produtoRepository.save(any(Produto.class))).thenReturn(produto);
        when(categoriaService.findById(anyLong())).thenReturn(new CategoriaDTO());
        
        ProdutoDTO resultado = produtoService.update(produtoDTO);
        
        assertNotNull(resultado);
        assertEquals(produtoDTO.getNome(), resultado.getNome());
        verify(produtoRepository).save(any(Produto.class));
    }

    @Test
    void adicionaProdutoAoEstoque_DeveAumentarQuantidade() {
        // Configurar o produto inicial
        Produto produtoInicial = new Produto();
        produtoInicial.setId(1L);
        produtoInicial.setNome("Produto Teste");
        produtoInicial.setDescricao("Descrição do Produto");
        produtoInicial.setPreco(100.0);
        produtoInicial.setQuantidade(10);
        produtoInicial.setCategoria(produto.getCategoria());
        produtoInicial.setCodigoBarras("123456789");
        produtoInicial.setUsuarioId(usuarioId);
        
        // Configurar o produto após atualização
        Produto produtoAtualizado = new Produto();
        produtoAtualizado.setId(1L);
        produtoAtualizado.setNome("Produto Teste");
        produtoAtualizado.setDescricao("Descrição do Produto");
        produtoAtualizado.setPreco(100.0);
        produtoAtualizado.setQuantidade(15); // quantidade atualizada
        produtoAtualizado.setCategoria(produto.getCategoria());
        produtoAtualizado.setCodigoBarras("123456789");
        produtoAtualizado.setUsuarioId(usuarioId);
        
        // Configurar os mocks necessários
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produtoInicial));
        when(produtoRepository.save(any(Produto.class))).thenReturn(produtoAtualizado);
        
        // Executar o teste
        ProdutoDTO resultado = produtoService.adicionaProdutoAoEstoque(1L, 5);

        // Verificações
        assertNotNull(resultado);
        assertEquals(15, resultado.getQuantidade());
        assertEquals("Produto Teste", resultado.getNome());
        assertEquals(100.0, resultado.getPreco());
        assertEquals(usuarioId, resultado.getUsuarioId());
        
        // Verificar se os métodos foram chamados
        verify(produtoRepository).findById(1L);
        verify(produtoRepository).save(any(Produto.class));
    }

    @Test
    void findByCodigoBarras_DeveRetornarProduto() {
        when(produtoRepository.findByCodigoBarras("123456789"))
            .thenReturn(Optional.of(produto));
        
        Optional<ProdutoDTO> resultado = produtoService.findByCodigoBarras("123456789");
        
        assertTrue(resultado.isPresent());
        assertEquals(produto.getCodigoBarras(), resultado.get().getCodigoBarras());
    }

    @Test
    void findAllByUsuarioId_DeveRetornarListaDeProdutos() {
        when(produtoRepository.findByUsuarioId(usuarioId))
            .thenReturn(Arrays.asList(produto));
        
        List<ProdutoDTO> resultado = produtoService.findAllByUsuarioId(usuarioId);
        
        assertNotNull(resultado);
        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
        assertEquals(usuarioId, resultado.get(0).getUsuarioId());
    }

    @Test
    void verificaQuantidadeProdutoEmEstoque_DeveLancarExcecao_QuandoQuantidadeInsuficiente() {
        produto.setQuantidade(5);
        
        assertThrows(IllegalArgumentException.class, 
            () -> produtoService.verificaQuantidadeProdutoEmEstoque(produto, 10));
    }
} 