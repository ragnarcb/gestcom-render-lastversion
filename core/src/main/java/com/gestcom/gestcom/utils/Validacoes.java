package com.gestcom.gestcom.utils;

import java.util.regex.Pattern;

public class Validacoes {
    
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final String SENHA_REGEX = "^(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=!*()\\-_¨£¢¬<>,.:;?°ºª\\[\\]{}])[A-Za-z0-9@#$%^&+=!*()\\-_¨£¢¬<>,.:;?°ºª\\[\\]{}]{8,}$";
    private static final String CEP_REGEX = "\\d{5}-\\d{3}";
    private static final String CPF_REGEX = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}";
    
    public static boolean validarEmail(String email) {
        return Pattern.compile(EMAIL_REGEX).matcher(email).matches();
    }
    
    public static boolean validarSenha(String senha) {
        return Pattern.compile(SENHA_REGEX).matcher(senha).matches();
    }
    
    public static boolean validarCEP(String cep) {
        return Pattern.compile(CEP_REGEX).matcher(cep).matches();
    }
    
    public static boolean validarCPF(String cpf) {
        if (!Pattern.compile(CPF_REGEX).matcher(cpf).matches()) {
            return false;
        }
        return validarDigitosCPF(cpf);
    }
    
    private static boolean validarDigitosCPF(String cpf) {
        cpf = cpf.replaceAll("[^0-9]", "");
        
        if (cpf.length() != 11) return false;
        
        // Verifica dígitos repetidos
        if (cpf.matches("(\\d)\\1{10}")) return false;
        
        // Calcula primeiro dígito verificador
        int soma = 0;
        for (int i = 0; i < 9; i++) {
            soma += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
        }
        int primeiroDigito = 11 - (soma % 11);
        if (primeiroDigito > 9) primeiroDigito = 0;
        
        // Calcula segundo dígito verificador
        soma = 0;
        for (int i = 0; i < 10; i++) {
            soma += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
        }
        int segundoDigito = 11 - (soma % 11);
        if (segundoDigito > 9) segundoDigito = 0;
        
        return Character.getNumericValue(cpf.charAt(9)) == primeiroDigito 
            && Character.getNumericValue(cpf.charAt(10)) == segundoDigito;
    }
} 