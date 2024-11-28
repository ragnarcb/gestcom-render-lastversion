package com.gestcom.gestcom.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.gestcom.gestcom.dto.ProdutoDTO;
import com.gestcom.gestcom.model.Produto;

@Mapper(componentModel = "spring")
public interface ProdutoMapper {

    ProdutoMapper INSTANCE = Mappers.getMapper(ProdutoMapper.class);

    ProdutoDTO toProdutoDTO(Produto produto);

    Produto toProduto(ProdutoDTO produtoDTO);

    default List<ProdutoDTO> toProdutoDTO(List<Produto> produtos) {
        if (produtos == null) {
            return null;
        }
        return produtos.stream()
                .map(this::toProdutoDTO)
                .collect(Collectors.toList());
    }

}
