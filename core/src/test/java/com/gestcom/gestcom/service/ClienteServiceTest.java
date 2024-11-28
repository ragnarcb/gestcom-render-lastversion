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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gestcom.gestcom.dto.ClienteDTO;
import com.gestcom.gestcom.model.Cliente;
import com.gestcom.gestcom.repository.ClienteRepository;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteService clienteService;

    private ClienteDTO clienteDTO;
    private Cliente cliente;
    private Long usuarioId;

    @BeforeEach
    void setUp() {
        usuarioId = 1L;
        
        clienteDTO = new ClienteDTO();
        clienteDTO.setId(1L);
        clienteDTO.setUsuario("Cliente Teste");
        clienteDTO.setEmail("teste@email.com");
        clienteDTO.setTelefone("11999999999");
        clienteDTO.setCpf("181.813.299-02");
        clienteDTO.setValorDevedor(0.0);
        clienteDTO.setCep("12345-678");
        clienteDTO.setLogradouro("Rua Teste");
        clienteDTO.setNumero("123");
        clienteDTO.setBairro("Bairro Teste");
        clienteDTO.setCidade("Cidade Teste");
        clienteDTO.setEstado("Estado Teste");
        clienteDTO.setStatusAtivo(true);
        clienteDTO.setUsuarioId(usuarioId);

        cliente = new Cliente();
        cliente.setId(1L);
        cliente.setUsuario("Cliente Teste");
        cliente.setEmail("teste@email.com");
        cliente.setTelefone("11999999999");
        cliente.setCpf("123.456.789-00");
        cliente.setValorDevedor(0.0);
        cliente.setCep("12345-678");
        cliente.setLogradouro("Rua Teste");
        cliente.setNumero("123");
        cliente.setBairro("Bairro Teste");
        cliente.setCidade("Cidade Teste");
        cliente.setEstado("Estado Teste");
        cliente.setStatusAtivo(true);
        cliente.setUsuarioId(usuarioId);
    }

    @Test
    void save_DeveRetornarClienteDTOSalvo() {
        when(clienteRepository.existsByUsuarioAndUsuarioId(anyString(), anyLong())).thenReturn(false);
        when(clienteRepository.existsByCpfAndUsuarioId(anyString(), anyLong())).thenReturn(false);
        when(clienteRepository.save(any(Cliente.class))).thenReturn(cliente);

        ClienteDTO resultado = clienteService.save(clienteDTO, usuarioId);

        assertNotNull(resultado);
        assertEquals(clienteDTO.getUsuario(), resultado.getUsuario());
        assertEquals(usuarioId, resultado.getUsuarioId());
        verify(clienteRepository).save(any(Cliente.class));
    }

    @Test
    void save_DeveLancarExcecao_QuandoUsuarioJaExiste() {
        when(clienteRepository.existsByUsuarioAndUsuarioId(anyString(), anyLong())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, 
            () -> clienteService.save(clienteDTO, usuarioId));
        
        verify(clienteRepository, never()).save(any());
    }

    @Test
    void save_DeveLancarExcecao_QuandoCPFJaExiste() {
        when(clienteRepository.existsByCpfAndUsuarioId(anyString(), anyLong())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, 
            () -> clienteService.save(clienteDTO, usuarioId));
        
        verify(clienteRepository, never()).save(any());
    }

    @Test
    void adicionarDivida_DeveAtualizarValorDevedor() {
        Double valorAdicional = 50.0;
        cliente.setValorDevedor(100.0);
        
        when(clienteRepository.findByIdAndUsuarioId(anyLong(), anyLong()))
            .thenReturn(Optional.of(cliente));
        when(clienteRepository.save(any(Cliente.class))).thenReturn(cliente);

        ClienteDTO resultado = clienteService.adicionarDivida(1L, valorAdicional, usuarioId);

        assertNotNull(resultado);
        assertEquals(150.0, resultado.getValorDevedor());
        verify(clienteRepository).save(any(Cliente.class));
    }

    @Test
    void abaterDivida_DeveReduzirValorDevedor() {
        Double valorAbatimento = 50.0;
        cliente.setValorDevedor(100.0);
        
        when(clienteRepository.findByIdAndUsuarioId(anyLong(), anyLong()))
            .thenReturn(Optional.of(cliente));
        when(clienteRepository.save(any(Cliente.class))).thenReturn(cliente);

        ClienteDTO resultado = clienteService.abaterDivida(1L, valorAbatimento, usuarioId);

        assertNotNull(resultado);
        assertEquals(50.0, resultado.getValorDevedor());
        verify(clienteRepository).save(any(Cliente.class));
    }

    @Test
    void findAllDevedores_DeveRetornarListaDeDevedores() {
        cliente.setValorDevedor(100.0);
        when(clienteRepository.findByValorDevedorGreaterThanAndUsuarioId(0.0, usuarioId))
            .thenReturn(Arrays.asList(cliente));

        List<ClienteDTO> resultado = clienteService.findAllDevedores(usuarioId);

        assertNotNull(resultado);
        assertFalse(resultado.isEmpty());
        assertEquals(100.0, resultado.get(0).getValorDevedor());
    }

    @Test
    void pesquisar_DeveRetornarClientesPorTermo() {
        String termo = "teste";
        when(clienteRepository.pesquisarPorTermo(termo, usuarioId))
            .thenReturn(Arrays.asList(cliente));

        List<ClienteDTO> resultado = clienteService.pesquisar(termo, usuarioId);

        assertNotNull(resultado);
        assertFalse(resultado.isEmpty());
        assertEquals(cliente.getUsuario(), resultado.get(0).getUsuario());
    }
}