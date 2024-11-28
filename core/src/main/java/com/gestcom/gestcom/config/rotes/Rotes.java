package com.gestcom.gestcom.config.rotes;

import java.util.List;

public class Rotes {

        public static final List<String> ADMIN_URLS = List.of(
                        "/usuario");

        public static final List<String> NORMAL_USER_URLS = List.of(
                        "/categoria",
                        "/categoria/**",
                        "/cliente",
                        "/cliente/**",
                        "/produto",
                        "/produto/**",
                        "/usuario",
                        "/usuario/**",
                        "/venda");

        public static final List<String> NORMAL_USER_POST_URLS = List.of(
                        "/categoria",
                        "/cliente",
                        "/cliente/**",
                        "/produto",
                        "/produto/**",
                        "/venda",
                        "/venda/**");

        public static final List<String> NORMAL_USER_GET_URLS = List.of(
                        "/categoria",
                        "/categoria/**",
                        "/cliente",
                        "/cliente/**",
                        "/produto",
                        "/produto/**",
                        "/venda",
                        "/venda/**");

        public static final List<String> PUBLIC_URLS = List.of(
                        "/api/v1/auth/**",
                        "/v2/api-docs",
                        "/v3/api-docs",
                        "/v3/api-docs/**",
                        "/swagger-resources",
                        "/swagger-resources/**",
                        "/configuration/ui",
                        "/configuration/security",
                        "/swagger-ui/**",
                        "/webjars/**",
                        "/swagger-ui.html",
                        "/h2",
                        "/h2/**",
                        "/usuario/login");
}
