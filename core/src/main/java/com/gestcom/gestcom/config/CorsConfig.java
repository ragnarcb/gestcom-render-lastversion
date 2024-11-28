package com.gestcom.gestcom.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Permite todos os origins ou especifique o seu frontend
        config.addAllowedOrigin("https://gestcom-yxi5.onrender.com/");
        
        // Permite todos os métodos HTTP necessários
        config.addAllowedMethod("*");
        
        // Permite todos os headers necessários
        config.addAllowedHeader("*");
        
        // Permite credenciais
        config.setAllowCredentials(true);
        
        // Expõe o header Authorization
        config.addExposedHeader("Authorization");
        
        // Define tempo máximo de cache para preflight
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}