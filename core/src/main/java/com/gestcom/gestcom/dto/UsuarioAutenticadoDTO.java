package com.gestcom.gestcom.dto;

import com.gestcom.gestcom.model.Token;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioAutenticadoDTO {
    private String usuario;
    private String email;
    private Token token;

}
