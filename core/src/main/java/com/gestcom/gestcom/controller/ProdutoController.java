package com.gestcom.gestcom.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestcom.gestcom.dto.BarcodeResponseDTO;
import com.gestcom.gestcom.dto.CategoriaDTO;
import com.gestcom.gestcom.dto.ProdutoDTO;
import com.gestcom.gestcom.model.Usuario;
import com.gestcom.gestcom.repository.UsuarioRepository;
import com.gestcom.gestcom.service.BarcodeService;
import com.gestcom.gestcom.service.CategoriaService;
import com.gestcom.gestcom.service.ProdutoService;

@RestController
@RequestMapping("/produto")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;
    
    @Autowired
    private CategoriaService categoriaService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private BarcodeService barcodeService;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    // Endpoint para salvar produto sem imagem
    @PostMapping
    public ResponseEntity<ProdutoDTO> save(@RequestBody ProdutoDTO produtoDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            UserDetails userDetails = usuarioRepository.findByUsuario(username);
            Usuario usuario = (Usuario) userDetails;
            
            // Validações básicas
            if (produtoDTO.getCategoria() == null || produtoDTO.getCategoria().getId() == null) {
                return ResponseEntity.badRequest().build();
            }
            
            // Verifica se a categoria existe e pertence ao usuário
            CategoriaDTO categoria = categoriaService.findById(produtoDTO.getCategoria().getId());
            if (!categoria.getUsuarioId().equals(usuario.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            // Define o usuarioId do produto
            produtoDTO.setUsuarioId(usuario.getId());
            
            return ResponseEntity.ok(produtoService.save(produtoDTO, usuario.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ProdutoDTO>> findAll(Authentication authentication) {
        String username = authentication.getName();
        UserDetails userDetails = usuarioRepository.findByUsuario(username);
        Usuario usuario = (Usuario) userDetails;
        
        return ResponseEntity.ok(produtoService.findAllByUsuarioId(usuario.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.findById(id));
    }

    @PutMapping
    public ResponseEntity<ProdutoDTO> update(@RequestBody ProdutoDTO produtoDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            UserDetails userDetails = usuarioRepository.findByUsuario(username);
            Usuario usuario = (Usuario) userDetails;
            
            // Verifica se o produto existe e pertence ao usuário
            ProdutoDTO existingProduto = produtoService.findById(produtoDTO.getId());
            if (existingProduto == null) {
                return ResponseEntity.notFound().build();
            }
            
            if (!existingProduto.getUsuarioId().equals(usuario.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            // Verifica se a nova categoria pertence ao usuário
            if (produtoDTO.getCategoria() != null && produtoDTO.getCategoria().getId() != null) {
                CategoriaDTO categoria = categoriaService.findById(produtoDTO.getCategoria().getId());
                if (!categoria.getUsuarioId().equals(usuario.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
            }
            
            // Define o usuarioId do produto
            produtoDTO.setUsuarioId(usuario.getId());
            
            return ResponseEntity.ok(produtoService.update(produtoDTO));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        produtoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/adiciona-produto-ao-estoque")
    public ResponseEntity<ProdutoDTO> adicionaProdutoAoEstoque(@RequestBody ProdutoDTO produtoDTO) {
        return ResponseEntity
                .ok(produtoService.adicionaProdutoAoEstoque(produtoDTO.getId(), produtoDTO.getQuantidade()));

    }

    @GetMapping("/codigo-barras/{codigoBarras}")
    public ResponseEntity<?> getOrCreateByCodigoBarras(@PathVariable String codigoBarras) {
        try {
            // Primeiro verifica se o produto existe no banco
            Optional<ProdutoDTO> existingProduct = produtoService.findByCodigoBarras(codigoBarras);
            
            if (existingProduct.isPresent()) {
                return ResponseEntity.ok(existingProduct.get());
            }

            // Se não encontrado, busca na API externa
            BarcodeResponseDTO apiResponse = barcodeService.getProductDetails(codigoBarras);
            
            if (apiResponse != null) {
                // Converte resposta da API para ProdutoDTO
                ProdutoDTO newProduto = new ProdutoDTO();
                newProduto.setNome(apiResponse.getDescription());
                
                // Tratamento seguro para marca nula
                String descricao = apiResponse.getDescription();
                if (apiResponse.getBrand() != null && apiResponse.getBrand().getName() != null) {
                    descricao = apiResponse.getBrand().getName() + " - " + descricao;
                }
                newProduto.setDescricao(descricao);
                
                newProduto.setCodigoBarras(codigoBarras);
                newProduto.setPreco(apiResponse.getAvg_price() != null ? apiResponse.getAvg_price() : 0.0);
                newProduto.setQuantidade(0);
                
                // Tratamento seguro para imagem
                if (apiResponse.getThumbnail() != null) {
                    try {
                        byte[] imageBytes = barcodeService.downloadImage(apiResponse.getThumbnail());
                        newProduto.setImagem(imageBytes);
                    } catch (Exception e) {
                        System.err.println("Erro ao baixar imagem: " + e.getMessage());
                        // Continua sem a imagem em caso de erro
                    }
                }
                
                return ResponseEntity.ok(newProduto);
            }
            
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            System.err.println("Erro ao processar código de barras: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar código de barras: " + e.getMessage());
        }
    }

    @GetMapping("/buscar-codigo-barras/{codigoBarras}")
    public ResponseEntity<ProdutoDTO> findByCodigoBarras(@PathVariable String codigoBarras) {
        try {
            System.out.println("Iniciando busca por código de barras: " + codigoBarras);
            Optional<ProdutoDTO> existingProduct = produtoService.findByCodigoBarras(codigoBarras);
            
            if (existingProduct.isPresent()) {
                System.out.println("Produto encontrado no banco de dados!");
                System.out.println("Detalhes do produto: " + existingProduct.get());
                return ResponseEntity.ok(existingProduct.get());
            }
            
            System.out.println("Produto não encontrado no banco de dados.");
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            System.err.println("Erro ao buscar produto por código de barras: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }
}
