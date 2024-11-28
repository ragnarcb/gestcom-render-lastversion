package com.gestcom.gestcom.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.gestcom.gestcom.dto.CategoriaDTO;
import com.gestcom.gestcom.dto.ProdutoDTO;
import com.gestcom.gestcom.model.Categoria;
import com.gestcom.gestcom.model.Produto;
import com.gestcom.gestcom.repository.ProdutoRepository;
import com.gestcom.gestcom.utils.ProdutoMapper;
import com.gestcom.gestcom.utils.ValidaObjetoPresente;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CategoriaService categoriaService;

    private static final ProdutoMapper produtoMapper = ProdutoMapper.INSTANCE;

    public ProdutoDTO save(ProdutoDTO produtoDTO, Long usuarioId) {
        try {
            // Define o ID como null para garantir que será um novo registro
            produtoDTO.setId(null);
            
            // Define o usuarioId
            produtoDTO.setUsuarioId(usuarioId);
            
            Produto produto = produtoMapper.toProduto(produtoDTO);
            produto.setUsuarioId(usuarioId);
            
            Produto savedProduto = produtoRepository.save(produto);
            return produtoMapper.toProdutoDTO(savedProduto);
            
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Erro ao salvar produto: verifique se a categoria existe");
        }
    }

    public ProdutoDTO findById(Long id) {
        Produto produto = ValidaObjetoPresente.validaObjetoPresente(produtoRepository.findById(id), "Produto");
        return produtoMapper.toProdutoDTO(produto);
    }

    public List<ProdutoDTO> findAll() {
        List<Produto> produtos = produtoRepository.findAll();
        return produtoMapper.toProdutoDTO(produtos);
    }

    public ProdutoDTO update(ProdutoDTO produtoDTO) {
        // Busca o produto existente diretamente do repositório
        Produto existingProduto = produtoRepository.findById(produtoDTO.getId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        // Atualiza os campos básicos
        existingProduto.setNome(produtoDTO.getNome());
        existingProduto.setDescricao(produtoDTO.getDescricao());
        existingProduto.setPreco(produtoDTO.getPreco());
        existingProduto.setQuantidade(produtoDTO.getQuantidade());
        existingProduto.setCodigoBarras(produtoDTO.getCodigoBarras());
        existingProduto.setUsuarioId(produtoDTO.getUsuarioId());

        // Atualiza a categoria se fornecida
        if (produtoDTO.getCategoria() != null && produtoDTO.getCategoria().getId() != null) {
            // Busca a categoria existente usando o método findById e converte para entidade
            CategoriaDTO categoriaDTO = categoriaService.findById(produtoDTO.getCategoria().getId());
            Categoria categoria = new Categoria();
            categoria.setId(categoriaDTO.getId());
            categoria.setNome(categoriaDTO.getNome());
            categoria.setDescricao(categoriaDTO.getDescricao());
            categoria.setUsuarioId(categoriaDTO.getUsuarioId());
            existingProduto.setCategoria(categoria);
        }

        // Mantém a imagem existente se não for fornecida uma nova
        if (produtoDTO.getImagem() != null) {
            existingProduto.setImagem(produtoDTO.getImagem());  // Agora aceita byte[] ao invés de String
        }

        // Salva diretamente o produto existente
        return produtoMapper.toProdutoDTO(produtoRepository.save(existingProduto));
    }

    public void deleteById(Long id) {
        findById(id);
        produtoRepository.deleteById(id);
    }

    public void verificaQuantidadeProdutoEmEstoque(Produto produto, Integer quantidade) {
        if (produto.getQuantidade() < quantidade) {
            throw new IllegalArgumentException("Produto " + produto.getNome() + " com estoque insuficiente. Quantidade disponível: " + produto.getQuantidade());
        }
    }

    public ProdutoDTO adicionaProdutoAoEstoque(Long produtoId, Integer quantidade) {
        Produto produto = produtoMapper.toProduto(findById(produtoId));
        produto.setQuantidade(produto.getQuantidade() + quantidade);
        return save(produtoMapper.toProdutoDTO(produto), produto.getUsuarioId());
    }

    public Optional<ProdutoDTO> findByCodigoBarras(String codigoBarras) {
        Optional<Produto> produto = produtoRepository.findByCodigoBarras(codigoBarras);
        return produto.map(produtoMapper::toProdutoDTO);
    }

    public List<ProdutoDTO> findAllByUsuarioId(Long usuarioId) {
        List<Produto> produtos = produtoRepository.findByUsuarioId(usuarioId);
        return produtoMapper.toProdutoDTO(produtos);
    }
}