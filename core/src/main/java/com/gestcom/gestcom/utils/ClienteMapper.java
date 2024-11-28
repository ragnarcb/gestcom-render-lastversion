package com.gestcom.gestcom.utils;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.gestcom.gestcom.dto.ClienteDTO;
import com.gestcom.gestcom.model.Cliente;

@Mapper
public interface ClienteMapper {
    
    ClienteMapper INSTANCE = Mappers.getMapper(ClienteMapper.class);

    Cliente toCliente(ClienteDTO clienteDTO);

    ClienteDTO toClienteDTO(Cliente cliente);

    List<ClienteDTO> toClienteDTO(List<Cliente> clientes);

    List<Cliente> toCliente(List<ClienteDTO> clientesDTO);
}