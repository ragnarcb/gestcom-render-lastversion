package com.gestcom.gestcom;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.gestcom.gestcom.controller.UsuarioController;
import com.gestcom.gestcom.dto.UsuarioDTO;
import com.gestcom.gestcom.model.UsuariosRoles;

@SpringBootApplication
public class GestcomApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestcomApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(UsuarioController usuarioController) {
        return args -> {
            UsuarioDTO usuarioAdmin = new UsuarioDTO(null, "admin", "admin@gmail.com", "Admin122!", UsuariosRoles.ADMIN);
            UsuarioDTO usuarioComum = new UsuarioDTO(null, "comum", "comum@gmail.com", "Comum1232!", UsuariosRoles.USER);

            usuarioController.save(usuarioAdmin);
            usuarioController.save(usuarioComum);
        };
    }

}
