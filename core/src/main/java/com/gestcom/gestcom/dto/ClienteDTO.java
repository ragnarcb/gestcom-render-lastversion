package com.gestcom.gestcom.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO {
    private Long id;
    private String usuario;
    private String email;
    private String telefone;
    private String cpf;
    private Double valorDevedor;
    private List<Integer> diasPreferencialPagamento;
    private String observacoes;
    private Boolean statusAtivo;
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;
    private Long usuarioId;
}