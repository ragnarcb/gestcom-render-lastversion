package com.gestcom.gestcom.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestcom.gestcom.dto.ClienteDTO;
import com.gestcom.gestcom.repository.ClienteRepository;
import com.gestcom.gestcom.utils.ClienteMapper;
import com.gestcom.gestcom.utils.Validacoes;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    private static final ClienteMapper clienteMapper = ClienteMapper.INSTANCE;

    private void validarValorDevedor(Double valor) {
        if (valor < 0) {
            throw new IllegalArgumentException("O valor devedor não pode ser negativo");
        }
    }

    private void validarClienteUnico(ClienteDTO clienteDTO, Long usuarioId) {
        if (clienteRepository.existsByUsuarioAndUsuarioId(clienteDTO.getUsuario(), usuarioId)) {
            throw new IllegalArgumentException("Já existe um cliente com este usuário");
        }
        if (clienteRepository.existsByCpfAndUsuarioId(clienteDTO.getCpf(), usuarioId)) {
            throw new IllegalArgumentException("Já existe um cliente com este CPF");
        }
    }

    public ClienteDTO save(ClienteDTO clienteDTO, Long usuarioId) {
        validarDadosCliente(clienteDTO);
        validarValorDevedor(clienteDTO.getValorDevedor());
        validarClienteUnico(clienteDTO, usuarioId);
        
        clienteDTO.setUsuarioId(usuarioId);
        return clienteMapper.toClienteDTO(clienteRepository.save(clienteMapper.toCliente(clienteDTO)));
    }

    private void validarDadosCliente(ClienteDTO clienteDTO) {
        if (!Validacoes.validarEmail(clienteDTO.getEmail())) {
            throw new IllegalArgumentException("Email inválido");
        }
        
        if (!Validacoes.validarCEP(clienteDTO.getCep())) {
            throw new IllegalArgumentException("CEP inválido. Use o formato: 12345-678");
        }
        
        if (!Validacoes.validarCPF(clienteDTO.getCpf())) {
            throw new IllegalArgumentException("CPF inválido. Use o formato: 123.456.789-00");
        }
    }

    public ClienteDTO findById(Long id, Long usuarioId) {
        return clienteMapper.toClienteDTO(
            clienteRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"))
        );
    }

    public List<ClienteDTO> findAll() {
        return clienteMapper.toClienteDTO(clienteRepository.findAll());
    }

    public ClienteDTO update(ClienteDTO clienteDTO, Long usuarioId) {
        validarDadosCliente(clienteDTO);
        validarValorDevedor(clienteDTO.getValorDevedor());
        
        ClienteDTO existingCliente = findById(clienteDTO.getId(), usuarioId);
        
        BeanUtils.copyProperties(clienteDTO, existingCliente, "id", "usuarioId");
        
        return save(existingCliente, usuarioId);
    }

    public void delete(Long id, Long usuarioId) {
        findById(id, usuarioId);
        clienteRepository.deleteById(id);
    }

    public ClienteDTO adicionarDivida(Long id, Double valor, Long usuarioId) {
        var cliente = clienteRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        if (valor < 0) {
            Double valorPagamento = Math.abs(valor);
            if (valorPagamento > cliente.getValorDevedor()) {
                throw new IllegalArgumentException(
                        String.format("Valor de pagamento (R$ %.2f) maior que a dívida atual (R$ %.2f)",
                                valorPagamento, cliente.getValorDevedor()));
            }
        }

        cliente.setValorDevedor(cliente.getValorDevedor() + valor);

        return clienteMapper.toClienteDTO(clienteRepository.save(cliente));
    }

    public ClienteDTO abaterDivida(Long id, Double valor, Long usuarioId) {
        if (valor <= 0) {
            throw new IllegalArgumentException("O valor deve ser maior que zero");
        }

        var cliente = clienteRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Double novoValor = cliente.getValorDevedor() - valor;

        if (novoValor < 0) {
            throw new IllegalArgumentException(
                    String.format("Valor de pagamento (R$ %.2f) maior que a dívida atual (R$ %.2f)",
                            valor, cliente.getValorDevedor()));
        }

        cliente.setValorDevedor(novoValor);
        return clienteMapper.toClienteDTO(clienteRepository.save(cliente));
    }

    public List<ClienteDTO> findAllDevedores(Long usuarioId) {
        return clienteMapper.toClienteDTO(
                clienteRepository.findByValorDevedorGreaterThanAndUsuarioId(0.0, usuarioId));
    }

    public List<ClienteDTO> findByCep(String cep, Long usuarioId) {
        return clienteMapper.toClienteDTO(
                clienteRepository.findByCepStartingWithAndUsuarioId(cep, usuarioId));
    }

    public List<ClienteDTO> pesquisar(String termo, Long usuarioId) {
        if (termo == null || termo.trim().isEmpty()) {
            throw new IllegalArgumentException("Termo de pesquisa não pode ser vazio");
        }
        return clienteMapper.toClienteDTO(
                clienteRepository.pesquisarPorTermo(termo.trim(), usuarioId));
    }

    public List<ClienteDTO> findAllByUsuarioId(Long usuarioId) {
        return clienteMapper.toClienteDTO(clienteRepository.findByUsuarioId(usuarioId));
    }
}