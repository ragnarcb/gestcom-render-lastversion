package com.gestcom.gestcom.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dataVenda;

    private LocalDateTime dataFechamento;

    @Column(nullable = false)
    private Boolean statusFechado = false;  // false = aberto, true = fechado

    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL)
    private List<ItemVenda> itens;

    private Double total;
    
    @Column(nullable = false)
    private Long usuarioId;
    
    // Opcional: Método helper para fechar a venda
    public void fecharVenda() {
        this.statusFechado = true;
        this.dataFechamento = LocalDateTime.now();
    }
}
