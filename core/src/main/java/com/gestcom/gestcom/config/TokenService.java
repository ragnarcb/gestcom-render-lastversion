package com.gestcom.gestcom.config;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.gestcom.gestcom.model.Usuario;
import com.gestcom.gestcom.utils.UsuarioMapper;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    private static final UsuarioMapper usuarioMapper = UsuarioMapper.INSTANCE;

    public String generateToken(Usuario usuario) {

        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            String token = JWT.create()
                    .withIssuer("gestcom-auth")
                    .withSubject(usuario.getUsuario())
                    .withExpiresAt(genExpirationDate())
                    .withClaim("role", usuario.getRole().getRole())
                    .sign(algorithm);
            return token;
        } catch (Exception e) {
            throw new RuntimeException("Error while generating token", e);
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("gestcom-auth")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            throw new RuntimeException("Token JWT inválido ou expirado!");
        }
    }

    private Instant genExpirationDate() {
        return LocalDateTime.now().plusHours(1).toInstant(ZoneOffset.of("-03:00"));
    }

    public String getUsernameFromToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("gestcom-auth")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            throw new RuntimeException("Token JWT inválido ou expirado!");
        }
    }

    public String getRoleFromToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("gestcom-auth")
                    .build()
                    .verify(token)
                    .getClaim("role")
                    .asString();
        } catch (JWTVerificationException exception) {
            throw new RuntimeException("Erro ao extrair role do token JWT.");
        }
    }

    public Map<String, String> getClaimsFromToken(String token) {
    try {

        Algorithm algorithm = Algorithm.HMAC256(secret);
        
        var decodedJWT = JWT.require(algorithm)
                .withIssuer("gestcom-auth")
                .build()
                .verify(token);

        Map<String, String> claims = new HashMap<>();

        claims.put("username", decodedJWT.getSubject());

        claims.put("role", decodedJWT.getClaim("role").asString()); 

        return claims;
    } catch (JWTVerificationException exception) {
        throw new RuntimeException("Erro ao extrair informações do token JWT.", exception);
    }
}
}