package com.gestcom.gestcom.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestcom.gestcom.model.Venda;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {
    
    @Query("SELECT v FROM Venda v WHERE v.dataVenda BETWEEN :inicio AND :fim " +
           "AND (:statusFechado IS NULL OR v.statusFechado = :statusFechado)")
    List<Venda> findByDataVendaBetweenAndStatusFechado(
        @Param("inicio") LocalDateTime inicio, 
        @Param("fim") LocalDateTime fim,
        @Param("statusFechado") Boolean statusFechado
    );
    
    // Método alternativo se quiser buscar sem considerar o status
    List<Venda> findByDataVendaBetween(
        LocalDateTime inicio, 
        LocalDateTime fim
    );
    
    // Método para buscar apenas por status
    List<Venda> findByStatusFechado(Boolean statusFechado);
    
    List<Venda> findByUsuarioId(Long usuarioId);
}
