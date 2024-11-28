package com.gestcom.gestcom.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.gestcom.gestcom.model.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByValorDevedorGreaterThanAndUsuarioId(Double valor, Long usuarioId);
    List<Cliente> findByCepStartingWithAndUsuarioId(String cep, Long usuarioId);

    @Query("SELECT c FROM Cliente c WHERE " +
           "c.usuarioId = :usuarioId AND (" +
           "LOWER(c.usuario) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(c.cpf) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(c.logradouro) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(c.bairro) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(c.cidade) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(c.estado) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(c.cep) LIKE LOWER(CONCAT('%', :termo, '%')))")
    List<Cliente> pesquisarPorTermo(String termo, Long usuarioId);

    List<Cliente> findByUsuarioId(Long usuarioId);

    boolean existsByUsuarioAndUsuarioId(String usuario, Long usuarioId);
    boolean existsByCpfAndUsuarioId(String cpf, Long usuarioId);
    Optional<Cliente> findByIdAndUsuarioId(Long id, Long usuarioId);

    List<Cliente> findByUsuarioContaining(String termo);
}