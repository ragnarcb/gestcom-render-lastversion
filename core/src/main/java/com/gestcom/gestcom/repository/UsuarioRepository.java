package com.gestcom.gestcom.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import com.gestcom.gestcom.model.Usuario;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
//    Optional<Usuario> findByUsuario(String usuario);

//    @Query("SELECT u FROM Usuario u WHERE u.usuario = :usuario")
//    UserDetails findUsuario(@Param("usuario") String usuario);

    UserDetails findByUsuario(String username);
}
