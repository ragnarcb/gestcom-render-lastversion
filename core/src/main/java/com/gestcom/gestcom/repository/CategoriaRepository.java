package com.gestcom.gestcom.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestcom.gestcom.model.Categoria;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByUsuarioId(Long usuarioId);
    Optional<Categoria> findByNomeAndUsuarioId(String nome, Long usuarioId);
    List<Categoria> findAllByUsuarioId(Long usuarioId);
}
