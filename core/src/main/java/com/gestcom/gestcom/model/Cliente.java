package com.gestcom.gestcom.model;

import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"cpf", "usuario_id"}),
    @UniqueConstraint(columnNames = {"usuario", "usuario_id"})
})
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String usuario;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String telefone;
    
    @Column(nullable = false)
    private String cpf;
    
    @Column(nullable = false)
    private Double valorDevedor = 0.0;
    
    @ElementCollection
    @CollectionTable(name = "dias_pagamento")
    private List<Integer> diasPreferencialPagamento;
    
    @Column(length = 500)
    private String observacoes;
    
    @Column(nullable = false)
    private Boolean statusAtivo = true;
    
    @Column(nullable = false)
    private String cep;
    
    @Column(nullable = false)
    private String logradouro;
    
    @Column(nullable = false)
    private String numero;
    
    private String complemento;
    
    @Column(nullable = false)
    private String bairro;
    
    @Column(nullable = false)
    private String cidade;
    
    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private Long usuarioId;
}
