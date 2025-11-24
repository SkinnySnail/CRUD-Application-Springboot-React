package com.crud.crud.application.util;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.crud.crud.application.dto.UserDto;

@DisplayName("UserValidation Tests")
class UserValidationTest {
    @Test
    @DisplayName("Username hợp lệ")
    void testValidUsername() {
        assertTrue(UserValidation.isValidUsername("user_123"));
        assertTrue(UserValidation.isValidUsername("abc"));
    }
    @Test
    @DisplayName("Username rỗng hoặc null")
    void testEmptyOrNullUsername() {
        assertFalse(UserValidation.isValidUsername(""));
        assertFalse(UserValidation.isValidUsername(null));
    }
    @Test
    @DisplayName("Username quá ngắn/quá dài")
    void testUsernameLength() {
        assertFalse(UserValidation.isValidUsername("ab"));
        assertFalse(UserValidation.isValidUsername("a".repeat(51)));
    }
    @Test
    @DisplayName("Username ký tự không hợp lệ")
    void testUsernameInvalidChars() {
        assertFalse(UserValidation.isValidUsername("user@name"));
        assertFalse(UserValidation.isValidUsername("user name"));
    }
    @Test
    @DisplayName("Password hợp lệ")
    void testValidPassword() {
        assertTrue(UserValidation.isValidPassword("Test123", "user"));
    }
    @Test
    @DisplayName("Password rỗng/quá ngắn/quá dài")
    void testPasswordEmptyOrLength() {
        assertFalse(UserValidation.isValidPassword("", "user"));
        assertFalse(UserValidation.isValidPassword("Test1", "user"));
        assertFalse(UserValidation.isValidPassword("a".repeat(101), "user"));
    }
    @Test
    @DisplayName("Password không đủ phức tạp")
    void testPasswordComplexity() {
        assertFalse(UserValidation.isValidPassword("abcdef", "user"));
        assertFalse(UserValidation.isValidPassword("123456", "user"));
    }
    @Test
    @DisplayName("Password chứa username")
    void testPasswordContainsUsername() {
        assertFalse(UserValidation.isValidPassword("user123", "user"));
    }
    @Test
    @DisplayName("validateUser trả về lỗi đúng")
    void testValidateUserErrors() {
        UserDto dto = new UserDto("ab", "123");
        Map<String, String> errors = UserValidation.validateUser(dto);
        assertTrue(errors.containsKey("username"));
        assertTrue(errors.containsKey("password"));
    }
    @Test
    @DisplayName("validateUser không lỗi với dữ liệu hợp lệ")
    void testValidateUserNoError() {
        UserDto dto = new UserDto("user123", "Test123");
        Map<String, String> errors = UserValidation.validateUser(dto);
        assertTrue(errors.isEmpty());
    }
}
