package com.gestcom.gestcom.repository;

import com.gestcom.gestcom.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, Long> {

    Token findByToken(String token);

}
