package com.gestcom.gestcom.controller;

import java.util.List;

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

import com.gestcom.gestcom.dto.CategoriaDTO;
import com.gestcom.gestcom.model.Usuario;
import com.gestcom.gestcom.repository.UsuarioRepository;
import com.gestcom.gestcom.service.CategoriaService;

@RestController
@RequestMapping("/categoria")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<CategoriaDTO> save(@RequestBody CategoriaDTO categoriaDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            UserDetails userDetails = usuarioRepository.findByUsuario(username);
            Usuario usuario = (Usuario) userDetails;
            
            categoriaDTO.setUsuarioId(usuario.getId());
            
            return ResponseEntity.ok(categoriaService.save(categoriaDTO, usuario.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> findAll(Authentication authentication) {
        String username = authentication.getName();
        UserDetails userDetails = usuarioRepository.findByUsuario(username);
        Usuario usuario = (Usuario) userDetails;
        
        return ResponseEntity.ok(categoriaService.findAllByUsuarioId(usuario.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> findById(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        UserDetails userDetails = usuarioRepository.findByUsuario(username);
        Usuario usuario = (Usuario) userDetails;
        
        CategoriaDTO categoria = categoriaService.findById(id);
        if (!categoria.getUsuarioId().equals(usuario.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(categoria);
    }

    @PutMapping
    public ResponseEntity<CategoriaDTO> update(@RequestBody CategoriaDTO categoriaDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            UserDetails userDetails = usuarioRepository.findByUsuario(username);
            Usuario usuario = (Usuario) userDetails;
            
            CategoriaDTO existingCategoria = categoriaService.findById(categoriaDTO.getId());
            if (existingCategoria == null) {
                return ResponseEntity.notFound().build();
            }
            
            if (!existingCategoria.getUsuarioId().equals(usuario.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            categoriaDTO.setUsuarioId(usuario.getId());
            
            return ResponseEntity.ok(categoriaService.update(categoriaDTO));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            UserDetails userDetails = usuarioRepository.findByUsuario(username);
            Usuario usuario = (Usuario) userDetails;
            
            CategoriaDTO categoria = categoriaService.findById(id);
            if (!categoria.getUsuarioId().equals(usuario.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            categoriaService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}