package com.gestcom.gestcom.dto;

import com.gestcom.gestcom.model.UsuariosRoles;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Long id;

    private String usuario;
    private String email;
    private String senha;
    private UsuariosRoles role;
}
