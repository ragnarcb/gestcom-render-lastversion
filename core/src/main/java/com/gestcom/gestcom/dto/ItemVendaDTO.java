package com.gestcom.gestcom.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import lombok.Data;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemVendaDTO {
    private Long id;
    private ProdutoIdDTO produto;
    private String nomeProduto;
    private Integer quantidade;
    private Double precoUnitario;
    private Double totalByProduto;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProdutoIdDTO {
        private Long id;
        private String nome;
    }
}