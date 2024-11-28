package com.gestcom.gestcom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemVendaRequestDTO {
    private ProdutoIdDTO produto;
    private Integer quantidade;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProdutoIdDTO {
        private Long id;
    }
}
