package com.gestcom.gestcom.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.gestcom.gestcom.dto.UsuarioDTO;
import com.gestcom.gestcom.model.Usuario;
import com.gestcom.gestcom.model.UsuariosRoles;
import com.gestcom.gestcom.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private UsuarioDTO usuarioDTO;
    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuarioDTO = new UsuarioDTO();
        usuarioDTO.setId(1L);
        usuarioDTO.setUsuario("usuario.teste");
        usuarioDTO.setEmail("usuario@teste.com");
        usuarioDTO.setSenha("Senha@123");
        usuarioDTO.setRole(UsuariosRoles.USER);

        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setUsuario("usuario.teste");
        usuario.setEmail("usuario@teste.com");
        usuario.setSenha("senhaCriptografada");
        usuario.setRole(UsuariosRoles.USER);
    }

    @Test
    void save_DeveSalvarUsuarioComSucesso() {
        when(passwordEncoder.encode(usuarioDTO.getSenha())).thenReturn("senhaCriptografada");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        UsuarioDTO resultado = usuarioService.save(usuarioDTO);

        assertNotNull(resultado);
        assertEquals(usuarioDTO.getUsuario(), resultado.getUsuario());
        assertEquals(usuarioDTO.getEmail(), resultado.getEmail());
        verify(passwordEncoder).encode("Senha@123");
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void save_DeveLancarExcecao_QuandoEmailInvalido() {
        usuarioDTO.setEmail("emailinvalido");

        assertThrows(IllegalArgumentException.class, 
            () -> usuarioService.save(usuarioDTO));
        
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void save_DeveLancarExcecao_QuandoSenhaInvalida() {
        usuarioDTO.setSenha("123"); // senha muito curta

        assertThrows(IllegalArgumentException.class, 
            () -> usuarioService.save(usuarioDTO));
        
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void findById_DeveRetornarUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        UsuarioDTO resultado = usuarioService.findById(1L);

        assertNotNull(resultado);
        assertEquals(usuario.getId(), resultado.getId());
        assertEquals(usuario.getUsuario(), resultado.getUsuario());
    }

    @Test
    void findById_DeveLancarExcecao_QuandoUsuarioNaoExistir() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> usuarioService.findById(1L));
    }

    @Test
    void findAll_DeveRetornarListaDeUsuarios() {
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(usuario));

        List<UsuarioDTO> resultado = usuarioService.findAll();

        assertNotNull(resultado);
        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
    }

    @Test
    void update_DeveAtualizarUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        usuarioDTO.setUsuario("novo.usuario");
        usuarioDTO.setEmail("novo@email.com");
        
        UsuarioDTO resultado = usuarioService.update(usuarioDTO);

        assertNotNull(resultado);
        assertEquals(usuarioDTO.getUsuario(), resultado.getUsuario());
        assertEquals(usuarioDTO.getEmail(), resultado.getEmail());
    }

    @Test
    void updatePassword_DeveAtualizarSenha() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.encode(anyString())).thenReturn("novaSenhaCriptografada");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        usuarioDTO.setSenha("NovaSenha@123");
        
        UsuarioDTO resultado = usuarioService.updatePassword(usuarioDTO);

        assertNotNull(resultado);
        verify(passwordEncoder).encode("NovaSenha@123");
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void delete_DeveRemoverUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        doNothing().when(usuarioRepository).deleteById(1L);

        assertDoesNotThrow(() -> usuarioService.delete(1L));
        
        verify(usuarioRepository).deleteById(1L);
    }
} 