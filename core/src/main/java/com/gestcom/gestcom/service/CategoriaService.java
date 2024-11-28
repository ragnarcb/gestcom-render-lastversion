package com.gestcom.gestcom.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.gestcom.gestcom.dto.CategoriaDTO;
import com.gestcom.gestcom.model.Categoria;
import com.gestcom.gestcom.repository.CategoriaRepository;
import com.gestcom.gestcom.utils.CategoriaMapper;
import com.gestcom.gestcom.utils.ValidaObjetoPresente;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    private static final CategoriaMapper categoriaMapper = CategoriaMapper.INSTANCE;

    public CategoriaDTO save(CategoriaDTO categoriaDTO, Long usuarioId) {
        try {
            System.out.println("Iniciando salvamento da categoria...");
            
            // Define o ID como null para garantir que será um novo registro
            categoriaDTO.setId(null);
            
            // Define o usuarioId recebido como parâmetro
            categoriaDTO.setUsuarioId(usuarioId);
            
            Categoria categoria = categoriaMapper.toCategoria(categoriaDTO);
            
            // Garante que o usuarioId está definido na entidade
            categoria.setUsuarioId(usuarioId);

            Categoria savedCategoria = categoriaRepository.save(categoria);
            return categoriaMapper.toCategoriaDTO(savedCategoria);
            
        } catch (DataIntegrityViolationException e) {
            System.err.println("Erro ao salvar categoria: " + e.getMessage());
            throw new IllegalArgumentException("Erro ao salvar categoria: nome já existe para este usuário");
        } catch (Exception e) {
            System.err.println("Erro inesperado ao salvar categoria: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public CategoriaDTO findById(Long id) {
        Categoria categoria = ValidaObjetoPresente.validaObjetoPresente(categoriaRepository.findById(id), "Categoria");
        return categoriaMapper.toCategoriaDTO(categoria);
    }

    public List<CategoriaDTO> findAll() {
        return categoriaMapper.toCategoriaDTO(categoriaRepository.findAll());
    }

    public CategoriaDTO update(CategoriaDTO categoriaDTO) {
        // Busca a categoria existente
        Categoria existingCategoria = categoriaRepository.findById(categoriaDTO.getId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        
        // Atualiza os campos
        existingCategoria.setNome(categoriaDTO.getNome());
        existingCategoria.setDescricao(categoriaDTO.getDescricao());
        existingCategoria.setUsuarioId(categoriaDTO.getUsuarioId());
        
        // Salva a categoria atualizada diretamente
        return categoriaMapper.toCategoriaDTO(categoriaRepository.save(existingCategoria));
    }

    public void deleteById(Long id) {
        findById(id);
        categoriaRepository.deleteById(id);
    }

    public List<CategoriaDTO> findAllByUsuarioId(Long usuarioId) {
        List<Categoria> categorias = categoriaRepository.findByUsuarioId(usuarioId);
        return categoriaMapper.toCategoriaDTO(categorias);
    }
}
