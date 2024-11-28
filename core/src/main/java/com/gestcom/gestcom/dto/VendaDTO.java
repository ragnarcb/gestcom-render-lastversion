package com.gestcom.gestcom.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendaDTO {

    private Long id;

    private LocalDateTime dataVenda;

    private Double total;

    private List<ItemVendaDTO> itens;

    private Long usuarioId;


    public void addItem(ItemVendaDTO item) {
        if (this.itens == null) {
            this.itens = new ArrayList<>();
        }
        this.itens.add(item);
    }
}
