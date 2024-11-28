package com.gestcom.gestcom.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.gestcom.gestcom.dto.VendaDTO;
import com.gestcom.gestcom.service.VendaService;
import com.gestcom.gestcom.repository.UsuarioRepository;
import com.gestcom.gestcom.model.Usuario;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/venda")
public class VendaController {

    @Autowired
    private VendaService vendaService;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<VendaDTO> save(@RequestBody VendaDTO vendaDTO, Authentication authentication) {
        try {
            String username = authentication.getName();
            UserDetails userDetails = usuarioRepository.findByUsuario(username);
            Usuario usuario = (Usuario) userDetails;
            
            // Validações básicas
            if (vendaDTO.getItens() == null || vendaDTO.getItens().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            // Define o usuarioId da venda
            vendaDTO.setUsuarioId(usuario.getId());
            
            return ResponseEntity.ok(vendaService.save(vendaDTO, usuario.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<VendaDTO>> findAll(Authentication authentication) {
        String username = authentication.getName();
        UserDetails userDetails = usuarioRepository.findByUsuario(username);
        Usuario usuario = (Usuario) userDetails;
        
        return ResponseEntity.ok(vendaService.findAllByUsuarioId(usuario.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendaDTO> findById(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        UserDetails userDetails = usuarioRepository.findByUsuario(username);
        Usuario usuario = (Usuario) userDetails;
        
        VendaDTO venda = vendaService.findById(id);
        if (!venda.getUsuarioId().equals(usuario.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(venda);
    }

    @PutMapping
    public ResponseEntity<VendaDTO> update(@RequestBody VendaDTO vendaDTO) {
        return ResponseEntity.ok(vendaService.update(vendaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vendaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/fechar")
    public ResponseEntity<VendaDTO> fecharVenda(@PathVariable Long id) {
        return ResponseEntity.ok(vendaService.fecharVenda(id));
    }

    @GetMapping("/relatorio")
    public ResponseEntity<Map<String, Object>> relatorioVendas(
            @RequestParam LocalDateTime inicio,
            @RequestParam LocalDateTime fim,
            @RequestParam(required = false) Boolean statusFechado) {
        
        Map<String, Object> relatorio = new HashMap<>();
        relatorio.put("vendas", vendaService.buscarVendasPorPeriodoEStatus(inicio, fim, statusFechado));
        relatorio.put("totalVendas", vendaService.calcularTotalVendasPorPeriodo(inicio, fim, statusFechado));
        
        return ResponseEntity.ok(relatorio);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<VendaDTO>> buscarVendas(
            @RequestParam LocalDateTime inicio,
            @RequestParam LocalDateTime fim,
            @RequestParam(required = false) Boolean statusFechado) {
        return ResponseEntity.ok(
            vendaService.buscarVendasPorPeriodoEStatus(inicio, fim, statusFechado));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException e) {
        Map<String, String> response = new HashMap<>();
        response.put("message", e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }
}
