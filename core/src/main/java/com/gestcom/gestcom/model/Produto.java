package com.gestcom.gestcom.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.gestcom.gestcom.config.ImageConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
    @UniqueConstraint(columnNames = {"nome", "usuario_id"})
})
public class Produto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String descricao;

    @Column(nullable = false)
    private Double preco;

    @Column(nullable = false)
    private Integer quantidade;
    
    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @JsonBackReference
    @OneToMany(mappedBy = "produto")
    private List<ItemVenda> itens;
    
    private String codigoBarras;

    @Convert(converter = ImageConverter.class)
    @Column(name = "imagem", columnDefinition = "bytea")
    private byte[] imagem;
    
    @Column(nullable = false)
    private Long usuarioId;
    
}
