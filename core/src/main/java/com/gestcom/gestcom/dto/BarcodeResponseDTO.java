package com.gestcom.gestcom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BarcodeResponseDTO {
    private String description;
    private String gtin;
    private String thumbnail;
    private Double avg_price;
    private Brand brand;
    private NCM ncm;
    private GPC gpc;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Brand {
        private String name;
        private String picture;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NCM {
        private String code;
        private String description;
        private String full_description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GPC {
        private String code;
        private String description;
    }

    public String getBrandName() {
        return brand != null ? brand.getName() : null;
    }

    public String getFormattedDescription() {
        if (brand != null && brand.getName() != null) {
            return brand.getName() + " - " + description;
        }
        return description;
    }
}