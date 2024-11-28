package com.gestcom.gestcom.utils;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.gestcom.gestcom.dto.UsuarioDTO;
import com.gestcom.gestcom.model.Usuario;

@Mapper
public interface UsuarioMapper {
    
    UsuarioMapper INSTANCE = Mappers.getMapper(UsuarioMapper.class);

    Usuario toUsuario(UsuarioDTO usuarioDTO);

    UsuarioDTO toUsuarioDTO(Usuario usuario);

    List<UsuarioDTO> toUsuarioDTO(List<Usuario> usuarios);

    List<Usuario> toUsuario(List<UsuarioDTO> usuariosDTO);
}
