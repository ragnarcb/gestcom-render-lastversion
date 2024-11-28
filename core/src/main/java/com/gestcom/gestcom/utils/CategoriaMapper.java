package com.gestcom.gestcom.utils;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.gestcom.gestcom.dto.CategoriaDTO;
import com.gestcom.gestcom.model.Categoria;

@Mapper
public interface CategoriaMapper {

    CategoriaMapper INSTANCE = Mappers.getMapper(CategoriaMapper.class);

    Categoria toCategoria(CategoriaDTO categoriaDTO);

    CategoriaDTO toCategoriaDTO(Categoria categoria);

    List<CategoriaDTO> toCategoriaDTO(List<Categoria> categorias);

    List<Categoria> toCategoria(List<CategoriaDTO> categoriasDTO);
}
