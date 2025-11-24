package com.crud.crud.application.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("JwtUtil Tests")
class JwtUtilTest {
    private final JwtUtil jwtUtil = new JwtUtil();

    @Test
    @DisplayName("Tạo và xác thực token")
    void testGenerateAndValidateToken() {
        String username = "testuser";
        String token = jwtUtil.generateToken(username);
        assertNotNull(token);
        assertEquals(username, jwtUtil.extractUsername(token));
        assertTrue(jwtUtil.validateToken(token, username));
    }

    @Test
    @DisplayName("Token không hợp lệ với username khác")
    void testInvalidToken() {
        String token = jwtUtil.generateToken("user1");
        assertFalse(jwtUtil.validateToken(token, "user2"));
    }
}
