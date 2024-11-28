package com.gestcom.gestcom.utils;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.mapstruct.Mapping;

import com.gestcom.gestcom.dto.VendaDTO;
import com.gestcom.gestcom.model.Venda;
import com.gestcom.gestcom.dto.ItemVendaDTO;
import com.gestcom.gestcom.model.ItemVenda;

@Mapper(componentModel = "spring")
public interface VendaMapper {

    VendaMapper INSTANCE = Mappers.getMapper(VendaMapper.class);

    @Mapping(target = "totalByProduto", expression = "java(itemVenda.getQuantidade() * itemVenda.getPrecoUnitario())")
    @Mapping(target = "nomeProduto", source = "produto.nome")
    @Mapping(target = "produto.nome", source = "produto.nome")
    ItemVendaDTO toItemVendaDTO(ItemVenda itemVenda);

    @Mapping(target = "produto.id", source = "produto.id")
    ItemVenda toItemVenda(ItemVendaDTO itemVendaDTO);

    VendaDTO toVendaDTO(Venda venda);

    Venda toVenda(VendaDTO vendaDTO);

    List<VendaDTO> toVendaDTO(List<Venda> vendas);

    List<Venda> toVenda(List<VendaDTO> vendasDTO);

}