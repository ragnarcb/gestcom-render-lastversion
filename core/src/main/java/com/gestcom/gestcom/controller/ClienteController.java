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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestcom.gestcom.dto.ClienteDTO;
import com.gestcom.gestcom.dto.ValorDTO;
import com.gestcom.gestcom.model.Usuario;
import com.gestcom.gestcom.repository.UsuarioRepository;
import com.gestcom.gestcom.service.ClienteService;

@RestController
@RequestMapping("/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<ClienteDTO> save(@RequestBody ClienteDTO clienteDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            UserDetails userDetails = usuarioRepository.findByUsuario(username);
            Usuario usuario = (Usuario) userDetails;
            
            return ResponseEntity.ok(clienteService.save(clienteDTO, usuario.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ClienteDTO>> findAll(Authentication authentication) {
        String username = authentication.getName();
        UserDetails userDetails = usuarioRepository.findByUsuario(username);
        Usuario usuario = (Usuario) userDetails;
        
        return ResponseEntity.ok(clienteService.findAllByUsuarioId(usuario.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> findById(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        UserDetails userDetails = usuarioRepository.findByUsuario(username);
        Usuario usuario = (Usuario) userDetails;
        
        ClienteDTO cliente = clienteService.findById(id, usuario.getId());
        return ResponseEntity.ok(cliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> update(@PathVariable Long id, @RequestBody ClienteDTO clienteDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            UserDetails userDetails = usuarioRepository.findByUsuario(username);
            Usuario usuario = (Usuario) userDetails;
            
            clienteDTO.setId(id);
            clienteDTO.setUsuarioId(usuario.getId());
            return ResponseEntity.ok(clienteService.update(clienteDTO, usuario.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            UserDetails userDetails = usuarioRepository.findByUsuario(username);
            Usuario usuario = (Usuario) userDetails;
            
            clienteService.delete(id, usuario.getId());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{id}/adicionar-divida")
    public ResponseEntity<ClienteDTO> adicionarDivida(
            @PathVariable Long id,
            @RequestBody ValorDTO valorDTO,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            UserDetails userDetails = usuarioRepository.findByUsuario(username);
            Usuario usuario = (Usuario) userDetails;
            
            return ResponseEntity.ok(clienteService.adicionarDivida(id, valorDTO.getValor(), usuario.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/abater-divida")
    public ResponseEntity<ClienteDTO> abaterDivida(
            @PathVariable Long id,
            @RequestBody ValorDTO valorDTO,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            UserDetails userDetails = usuarioRepository.findByUsuario(username);
            Usuario usuario = (Usuario) userDetails;
            
            return ResponseEntity.ok(clienteService.abaterDivida(id, valorDTO.getValor(), usuario.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/devedores")
    public ResponseEntity<List<ClienteDTO>> findAllDevedores(Authentication authentication) {
        String username = authentication.getName();
        UserDetails userDetails = usuarioRepository.findByUsuario(username);
        Usuario usuario = (Usuario) userDetails;
        
        return ResponseEntity.ok(clienteService.findAllDevedores(usuario.getId()));
    }

    @GetMapping("/por-cep/{cep}")
    public ResponseEntity<List<ClienteDTO>> findByCep(@PathVariable String cep, Authentication authentication) {
        String username = authentication.getName();
        UserDetails userDetails = usuarioRepository.findByUsuario(username);
        Usuario usuario = (Usuario) userDetails;
        
        return ResponseEntity.ok(clienteService.findByCep(cep, usuario.getId()));
    }

    @GetMapping("/pesquisar")
    public ResponseEntity<List<ClienteDTO>> pesquisar(@RequestParam String termo, Authentication authentication) {
        String username = authentication.getName();
        UserDetails userDetails = usuarioRepository.findByUsuario(username);
        Usuario usuario = (Usuario) userDetails;
        
        return ResponseEntity.ok(clienteService.pesquisar(termo, usuario.getId()));
    }
}