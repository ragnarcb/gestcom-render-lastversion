package com.gestcom.gestcom.service;

import java.time.LocalDateTime;
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
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gestcom.gestcom.dto.ItemVendaDTO;
import com.gestcom.gestcom.dto.VendaDTO;
import com.gestcom.gestcom.model.ItemVenda;
import com.gestcom.gestcom.model.Produto;
import com.gestcom.gestcom.model.Venda;
import com.gestcom.gestcom.repository.ProdutoRepository;
import com.gestcom.gestcom.repository.VendaRepository;
import com.gestcom.gestcom.utils.VendaMapper;

@ExtendWith(MockitoExtension.class)
class VendaServiceTest {

    @Mock
    private VendaRepository vendaRepository;

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private VendaMapper vendaMapper;

    @InjectMocks
    private VendaService vendaService;

    private VendaDTO vendaDTO;
    private Venda venda;
    private Produto produto;
    private ItemVenda itemVenda;
    private ItemVendaDTO itemVendaDTO;
    private Long usuarioId;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;

    @BeforeEach
    void setUp() {
        usuarioId = 1L;
        dataInicio = LocalDateTime.now().minusDays(7);
        dataFim = LocalDateTime.now();

        // Configurar produto
        produto = new Produto();
        produto.setId(1L);
        produto.setNome("Produto Teste");
        produto.setPreco(10.0);
        produto.setQuantidade(100);

        // Configurar itemVendaDTO
        itemVendaDTO = new ItemVendaDTO();
        ItemVendaDTO.ProdutoIdDTO produtoIdDTO = new ItemVendaDTO.ProdutoIdDTO();
        produtoIdDTO.setId(1L);
        produtoIdDTO.setNome("Produto Teste");
        itemVendaDTO.setProduto(produtoIdDTO);
        itemVendaDTO.setQuantidade(2);
        itemVendaDTO.setPrecoUnitario(10.0);
        itemVendaDTO.setNomeProduto("Produto Teste");

        // Configurar vendaDTO
        vendaDTO = new VendaDTO();
        vendaDTO.setId(1L);
        vendaDTO.setDataVenda(LocalDateTime.now());
        vendaDTO.setUsuarioId(usuarioId);
        vendaDTO.setTotal(20.0);
        vendaDTO.setItens(Arrays.asList(itemVendaDTO));

        // Configurar itemVenda
        itemVenda = new ItemVenda();
        itemVenda.setProduto(produto);
        itemVenda.setQuantidade(2);
        itemVenda.setPrecoUnitario(10.0);
        itemVenda.setTotal(20.0);

        // Configurar venda
        venda = new Venda();
        venda.setId(1L);
        venda.setDataVenda(LocalDateTime.now());
        venda.setStatusFechado(false);
        venda.setUsuarioId(usuarioId);
        venda.setTotal(20.0);
        venda.setItens(Arrays.asList(itemVenda));
    }

    @Test
    void save_DeveSalvarVendaComSucesso() {
        when(produtoRepository.findById(anyLong())).thenReturn(Optional.of(produto));
        when(vendaRepository.save(any(Venda.class))).thenReturn(venda);
        when(vendaMapper.toVendaDTO(any(Venda.class))).thenReturn(vendaDTO);

        VendaDTO resultado = vendaService.save(vendaDTO, usuarioId);

        assertNotNull(resultado);
        assertEquals(20.0, resultado.getTotal());
        verify(produtoRepository).save(any(Produto.class));
        verify(vendaRepository).save(any(Venda.class));
    }

    @Test
    void save_DeveLancarExcecao_QuandoEstoqueInsuficiente() {
        produto.setQuantidade(1); // Quantidade menor que a solicitada
        when(produtoRepository.findById(anyLong())).thenReturn(Optional.of(produto));

        assertThrows(RuntimeException.class, 
            () -> vendaService.save(vendaDTO, usuarioId));
    }

    @Test
    void fecharVenda_DeveFecharVendaComSucesso() {
        when(vendaRepository.findById(anyLong())).thenReturn(Optional.of(venda));
        when(vendaRepository.save(any(Venda.class))).thenReturn(venda);
        when(vendaMapper.toVendaDTO(any(Venda.class))).thenReturn(vendaDTO);

        VendaDTO resultado = vendaService.fecharVenda(1L);

        assertNotNull(resultado);
        assertTrue(venda.getStatusFechado());
        assertNotNull(venda.getDataFechamento());
    }

   @Test
void buscarVendasPorPeriodoEStatus_DeveRetornarVendas() {
    // Preparação
    List<Venda> vendas = Arrays.asList(venda);
    
    when(vendaRepository.findByDataVendaBetweenAndStatusFechado(
        dataInicio, 
        dataFim, 
        false))
        .thenReturn(vendas);
    
    when(vendaMapper.toVendaDTO(any(Venda.class)))
        .thenReturn(vendaDTO);

    // Execução
    List<VendaDTO> resultado = vendaService.buscarVendasPorPeriodoEStatus(
        dataInicio, dataFim, false);

    // Verificações
    assertNotNull(resultado);
    assertFalse(resultado.isEmpty());
    assertEquals(1, resultado.size());
    assertEquals(vendaDTO.getId(), resultado.get(0).getId());
}

    @Test
    void calcularTotalVendasPorPeriodo_DeveRetornarTotal() {
        when(vendaRepository.findByDataVendaBetweenAndStatusFechado(
            any(LocalDateTime.class), any(LocalDateTime.class), any()))
            .thenReturn(Arrays.asList(venda));

        Double resultado = vendaService.calcularTotalVendasPorPeriodo(
            dataInicio, dataFim, false);

        assertEquals(20.0, resultado);
    }

    @Test
    void findAllByUsuarioId_DeveRetornarVendasDoUsuario() {
        when(vendaRepository.findByUsuarioId(usuarioId))
            .thenReturn(Arrays.asList(venda));
        when(vendaMapper.toVendaDTO(anyList()))
            .thenReturn(Arrays.asList(vendaDTO));

        List<VendaDTO> resultado = vendaService.findAllByUsuarioId(usuarioId);

        assertNotNull(resultado);
        assertFalse(resultado.isEmpty());
        assertEquals(usuarioId, resultado.get(0).getUsuarioId());
    }
}