package com.gestcom.gestcom.model;

public enum UsuariosRoles {
    ADMIN("ADMIN"),
    USER("USER");

    private String role;

    UsuariosRoles(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
