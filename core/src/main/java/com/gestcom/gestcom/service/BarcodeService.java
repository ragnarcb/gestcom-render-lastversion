package com.gestcom.gestcom.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.gestcom.gestcom.dto.BarcodeResponseDTO;

@Service
public class BarcodeService {
    private final String API_URL = "https://api.cosmos.bluesoft.com.br/gtins/";
    private final String API_TOKEN = "ybCXGoQ1pAJUVbvEvQzixA";

    public BarcodeResponseDTO getProductDetails(String gtin) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        
        headers.set("X-Cosmos-Token", API_TOKEN);
        headers.set("Content-Type", "application/json");
        headers.set("User-Agent", "Cosmos-API-Request");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            String fullUrl = API_URL + gtin + ".json";
            System.out.println("Fazendo requisição para: " + fullUrl);
            System.out.println("Headers: " + headers);

            ResponseEntity<BarcodeResponseDTO> response = restTemplate.exchange(
                fullUrl,
                HttpMethod.GET,
                entity,
                BarcodeResponseDTO.class
            );

            System.out.println("Status da resposta: " + response.getStatusCode());
            System.out.println("Corpo da resposta: " + response.getBody());

            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.err.println("Erro na requisição: " + e.getStatusCode());
            System.err.println("Corpo do erro: " + e.getResponseBodyAsString());
            
            if (e.getStatusCode().value() == 404) {
                return null;
            }
            throw e;
        } catch (Exception e) {
            System.err.println("Erro inesperado: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao buscar produto na API Cosmos", e);
        }
    }

    public byte[] downloadImage(String imageUrl) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Cosmos-API-Request");
            headers.set("Accept", "image/jpeg, image/png, image/webp, image/*");
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<byte[]> response = restTemplate.exchange(
                imageUrl,
                HttpMethod.GET,
                entity,
                byte[].class
            );
            
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Erro ao baixar imagem: " + e.getMessage());
            return null;
        }
    }
}