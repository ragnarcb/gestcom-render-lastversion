package com.gestcom.gestcom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoDTO {

    private Long id;
    private String nome;
    private String descricao;
    private Double preco;
    private Integer quantidade;
    private CategoriaProdutoDTO categoria;
    private String codigoBarras;
    private byte[] imagem;
    private Long usuarioId;
}
