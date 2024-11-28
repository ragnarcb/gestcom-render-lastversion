package com.gestcom.gestcom.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gestcom.gestcom.dto.UsuarioDTO;
import com.gestcom.gestcom.model.Usuario;
import com.gestcom.gestcom.repository.UsuarioRepository;
import com.gestcom.gestcom.utils.UsuarioMapper;
import com.gestcom.gestcom.utils.ValidaObjetoPresente;
import com.gestcom.gestcom.utils.Validacoes;

@Service
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    private static final UsuarioMapper usuarioMapper = UsuarioMapper.INSTANCE;

    public UsuarioDTO save(UsuarioDTO usuarioDTO) {
        if (!Validacoes.validarEmail(usuarioDTO.getEmail())) {
            throw new IllegalArgumentException("Email inválido");
        }
        
        if (!Validacoes.validarSenha(usuarioDTO.getSenha())) {
            throw new IllegalArgumentException("Senha deve conter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais");
        }

        usuarioDTO.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));

        return usuarioMapper.toUsuarioDTO(usuarioRepository.save(usuarioMapper.toUsuario(usuarioDTO)));

    }

    public UsuarioDTO findById(Long id) {

        return usuarioMapper
                .toUsuarioDTO(ValidaObjetoPresente.validaObjetoPresente(usuarioRepository.findById(id), "Usuario"));
    }

    public List<UsuarioDTO> findAll() {
        return usuarioMapper.toUsuarioDTO(usuarioRepository.findAll());
    }

    public UsuarioDTO update(UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioRepository.findById(usuarioDTO.getId())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Atualiza apenas os dados básicos
        if (usuarioDTO.getUsuario() != null) usuario.setUsuario(usuarioDTO.getUsuario());
        if (usuarioDTO.getEmail() != null) usuario.setEmail(usuarioDTO.getEmail());
        if (usuarioDTO.getRole() != null) usuario.setRole(usuarioDTO.getRole());
        
        return usuarioMapper.toUsuarioDTO(usuarioRepository.save(usuario));
    }

    public UsuarioDTO updatePassword(UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioRepository.findById(usuarioDTO.getId())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Atualiza apenas a senha
        usuario.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));
        
        return usuarioMapper.toUsuarioDTO(usuarioRepository.save(usuario));
    }

    public void delete(Long id) {
        findById(id);

        usuarioRepository.deleteById(id);
    }

}