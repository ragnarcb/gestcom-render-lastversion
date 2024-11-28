package com.gestcom.gestcom.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestcom.gestcom.dto.ItemVendaDTO;
import com.gestcom.gestcom.dto.VendaDTO;
import com.gestcom.gestcom.model.ItemVenda;
import com.gestcom.gestcom.model.Produto;
import com.gestcom.gestcom.model.Venda;
import com.gestcom.gestcom.repository.ProdutoRepository;
import com.gestcom.gestcom.repository.VendaRepository;
import com.gestcom.gestcom.utils.ProdutoMapper;
import com.gestcom.gestcom.utils.ValidaObjetoPresente;
import com.gestcom.gestcom.utils.VendaMapper;

@Service
@Transactional
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private VendaMapper vendaMapper;

    private static final ProdutoMapper produtoMapper = ProdutoMapper.INSTANCE;

    public Venda realizarVenda(VendaDTO vendaDTO) {
        Venda venda = new Venda();
        venda.setDataVenda(LocalDateTime.now());
        venda.setUsuarioId(vendaDTO.getUsuarioId());
        venda.setStatusFechado(false);
        
        List<ItemVenda> itens = new ArrayList<>();
        
        for (ItemVendaDTO itemDTO : vendaDTO.getItens()) {
            Long produtoId = itemDTO.getProduto().getId();
            Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
                
            // Verifica estoque
            if (produto.getQuantidade() < itemDTO.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente");
            }
            
            ItemVenda item = new ItemVenda();
            item.setVenda(venda);
            item.setProduto(produto);
            item.setQuantidade(itemDTO.getQuantidade());
            item.setPrecoUnitario(produto.getPreco());
            item.setTotal(item.getQuantidade() * item.getPrecoUnitario());
            
            // Atualiza o estoque do produto
            produto.setQuantidade(produto.getQuantidade() - itemDTO.getQuantidade());
            produtoRepository.save(produto);
            
            itens.add(item);
        }
        
        venda.setItens(itens);
        venda.setTotal(itens.stream().mapToDouble(ItemVenda::getTotal).sum());
        
        return vendaRepository.save(venda);
    }

    public VendaDTO findById(Long id) {
        Venda venda = ValidaObjetoPresente.validaObjetoPresente(vendaRepository.findById(id), "Venda");
        return vendaMapper.toVendaDTO(venda);
    }

    public List<VendaDTO> findAllByUsuarioId(Long usuarioId) {
        List<Venda> vendas = vendaRepository.findByUsuarioId(usuarioId);
        return vendaMapper.toVendaDTO(vendas);
    }

    public VendaDTO update(VendaDTO vendaDTO) {
        VendaDTO existingVenda = findById(vendaDTO.getId());
        vendaDTO.setUsuarioId(existingVenda.getUsuarioId());
        return save(vendaDTO, existingVenda.getUsuarioId());
    }

    public void deleteById(Long id) {

        findById(id);

        vendaRepository.deleteById(id);
    }

    public VendaDTO fecharVenda(Long id) {
        Venda venda = ValidaObjetoPresente.validaObjetoPresente(
            vendaRepository.findById(id), "Venda");
            
        if (venda.getStatusFechado()) {
            throw new IllegalStateException("Venda já está fechada");
        }
        
        venda.setStatusFechado(true);
        venda.setDataFechamento(LocalDateTime.now());
        venda.fecharVenda();
        return vendaMapper.toVendaDTO(vendaRepository.save(venda));
    }

    public List<VendaDTO> buscarVendasPorPeriodoEStatus(
            LocalDateTime inicio, 
            LocalDateTime fim, 
            Boolean statusFechado) {
        return vendaRepository.findByDataVendaBetweenAndStatusFechado(inicio, fim, statusFechado)
                .stream()
                .map(vendaMapper::toVendaDTO)
                .collect(Collectors.toList());
    }

    public Double calcularTotalVendasPorPeriodo(
            LocalDateTime inicio, 
            LocalDateTime fim, 
            Boolean statusFechado) {
        return vendaRepository
            .findByDataVendaBetweenAndStatusFechado(inicio, fim, statusFechado)
            .stream()
            .mapToDouble(Venda::getTotal)
            .sum();
    }

    public List<VendaDTO> buscarVendasPorStatus(Boolean statusFechado) {
        return vendaRepository.findByStatusFechado(statusFechado)
                .stream()
                .map(vendaMapper::toVendaDTO)
                .collect(Collectors.toList());
    }

    public VendaDTO save(VendaDTO vendaDTO, Long usuarioId) {
        Venda venda = new Venda();
        venda.setDataVenda(LocalDateTime.now());
        venda.setUsuarioId(usuarioId);
        venda.setStatusFechado(false);
        
        List<ItemVenda> itens = new ArrayList<>();
        Double totalVenda = 0.0;
        
        if (vendaDTO.getItens() != null) {
            for (ItemVendaDTO itemDTO : vendaDTO.getItens()) {
                Long produtoId = itemDTO.getProduto().getId();
                Produto produto = produtoRepository.findById(produtoId)
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
                
                if (produto.getQuantidade() < itemDTO.getQuantidade()) {
                    throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
                }
                
                ItemVenda item = new ItemVenda();
                item.setVenda(venda);
                item.setProduto(produto);
                item.setQuantidade(itemDTO.getQuantidade());
                item.setPrecoUnitario(produto.getPreco());
                item.setTotal(item.getQuantidade() * item.getPrecoUnitario());
                
                // Atualiza o nome do produto no DTO
                itemDTO.setNomeProduto(produto.getNome());
                itemDTO.getProduto().setNome(produto.getNome());
                
                totalVenda += item.getTotal();
                
                produto.setQuantidade(produto.getQuantidade() - itemDTO.getQuantidade());
                produtoRepository.save(produto);
                
                itens.add(item);
            }
        }
        
        venda.setItens(itens);
        venda.setTotal(totalVenda);
        
        Venda savedVenda = vendaRepository.save(venda);
        VendaDTO vendaResponse = vendaMapper.toVendaDTO(savedVenda);

        // Atualiza o totalByProduto em cada ItemVendaDTO
        vendaResponse.getItens().forEach(item -> 
            item.setTotalByProduto(item.getQuantidade() * item.getPrecoUnitario())
        );

        return vendaResponse;
    }
}
