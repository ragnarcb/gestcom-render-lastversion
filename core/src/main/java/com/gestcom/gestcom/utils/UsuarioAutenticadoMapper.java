package com.gestcom.gestcom.utils;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.gestcom.gestcom.dto.UsuarioAutenticadoDTO;
import com.gestcom.gestcom.model.UsuarioAutenticado;

@Mapper
public interface UsuarioAutenticadoMapper {

    UsuarioAutenticadoMapper INSTANCE = Mappers.getMapper(UsuarioAutenticadoMapper.class);

    UsuarioAutenticado toUsuarioAutenticado(UsuarioAutenticado usuarioAutenticado);

    UsuarioAutenticadoDTO toUsuarioAutenticadoDTO(UsuarioAutenticado usuarioAutenticado);

    List<UsuarioAutenticadoDTO> toUsuarioAutenticadoDTO(List<UsuarioAutenticado> usuariosAutenticados);

    List<UsuarioAutenticado> toUsuarioAutenticado(List<UsuarioAutenticadoDTO> usuariosAutenticadosDTO);
}
