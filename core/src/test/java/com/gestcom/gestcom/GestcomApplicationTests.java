package com.gestcom.gestcom;

import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class GestcomApplicationTests {

	@Test
	void contextLoads() {
		// Teste básico para verificar se o contexto carrega
		assertTrue(true);
	}

}
