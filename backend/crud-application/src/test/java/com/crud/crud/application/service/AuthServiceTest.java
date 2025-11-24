
package com.crud.crud.application.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.crud.crud.application.dto.UserDto;
import com.crud.crud.application.entity.User;
import com.crud.crud.application.repository.UserRepository;
import com.crud.crud.application.util.PasswordUtil;

@DisplayName("AuthService Login Unit Tests")
class AuthServiceTest {
    @Mock
    private UserRepository userRepository;

    private PasswordUtil passwordUtil;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        passwordUtil = new PasswordUtil();
        // Inject PasswordUtil instance thật vào authService bằng reflection
        try {
            java.lang.reflect.Field field = AuthService.class.getDeclaredField("passwordUtil");
            field.setAccessible(true);
            field.set(authService, passwordUtil);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @Test
    @DisplayName("TC1: Login thành công với credentials hợp lệ")
    void testLoginSuccess() {
        String username = "testuser";
        String password = "Test123";
        // Hash password đúng cách để PasswordUtil.verifyPassword trả về true
        String hashed = passwordUtil.hashPassword(password);
        User user = new User();
        user.setUsername(username);
        user.setPassword(hashed);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        User result = authService.login(new UserDto(username, password));
        assertNotNull(result);
        assertEquals(username, result.getUsername());
        verify(userRepository, times(1)).findByUsername(username);
    }


    @Test
    @DisplayName("TC2: Login thất bại với username không tồn tại")
    void testLoginWithNonExistentUsername() {
        String username = "wronguser";
        String password = "Test123";
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        User result = authService.login(new UserDto(username, password));
        assertNull(result);
        verify(userRepository, times(1)).findByUsername(username);
    }


    @Test
    @DisplayName("TC3: Login thất bại với password sai")
    void testLoginWithWrongPassword() {
        String username = "testuser";
        String password = "WrongPass";
        // Hash a different password so verifyPassword will fail
        String hashed = passwordUtil.hashPassword("CorrectPass123");
        User user = new User();
        user.setUsername(username);
        user.setPassword(hashed);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        User result = authService.login(new UserDto(username, password));
        assertNull(result);
        verify(userRepository, times(1)).findByUsername(username);
    }


    @Test
    @DisplayName("TC4: Login thất bại với validation lỗi (username rỗng)")
    void testLoginWithEmptyUsername() {
        String username = "";
        String password = "Test123";
        // UserService.login will call userRepository.findByUsername("")
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
        User result = authService.login(new UserDto(username, password));
        assertNull(result);
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    @DisplayName("TC5: Login thất bại với validation lỗi (password rỗng)")
    void testLoginWithEmptyPassword() {
        String username = "testuser";
        String password = "";
        // UserService.login will call userRepository.findByUsername(username)
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
        User result = authService.login(new UserDto(username, password));
        assertNull(result);
        verify(userRepository, times(1)).findByUsername(username);
    }
}
