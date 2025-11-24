package com.crud.crud.application.util;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("PasswordUtil Tests")
class PasswordUtilTest {
    private final PasswordUtil passwordUtil = new PasswordUtil();

    @Test
    @DisplayName("Hash và verify password đúng")
    void testHashAndVerifyPassword() {
        String raw = "Test123";
        String hash = passwordUtil.hashPassword(raw);
        assertNotNull(hash);
        assertTrue(passwordUtil.verifyPassword(raw, hash));
    }

    @Test
    @DisplayName("Verify password sai")
    void testVerifyWrongPassword() {
        String raw = "Test123";
        String hash = passwordUtil.hashPassword(raw);
        assertFalse(passwordUtil.verifyPassword("WrongPass", hash));
    }
}
