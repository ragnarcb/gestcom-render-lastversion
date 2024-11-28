package com.gestcom.gestcom.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioAutenticado {

    private String usuario;
    private String email;
    private Token token;

}