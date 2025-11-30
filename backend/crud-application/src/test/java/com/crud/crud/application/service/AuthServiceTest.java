
package com.crud.crud.application.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
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

    @Test
    @DisplayName("TC6: Login với overloaded method login(String, String)")
    void testLoginWithStringParameters() {
        String username = "testuser";
        String password = "Test123";
        String hashed = passwordUtil.hashPassword(password);
        User user = new User();
        user.setUsername(username);
        user.setPassword(hashed);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        User result = authService.login(username, password);
        assertNotNull(result);
        assertEquals(username, result.getUsername());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    @DisplayName("TC7: existsByUsername - Username tồn tại")
    void testExistsByUsername_Exists() {
        String username = "testuser";
        when(userRepository.existsByUsername(username)).thenReturn(true);

        boolean result = authService.existsByUsername(username);
        assertTrue(result);
        verify(userRepository, times(1)).existsByUsername(username);
    }

    @Test
    @DisplayName("TC8: existsByUsername - Username không tồn tại")
    void testExistsByUsername_NotExists() {
        String username = "nonexistent";
        when(userRepository.existsByUsername(username)).thenReturn(false);

        boolean result = authService.existsByUsername(username);
        assertFalse(result);
        verify(userRepository, times(1)).existsByUsername(username);
    }

    @Test
    @DisplayName("TC9: findByUsername - Tìm thấy user")
    void testFindByUsername_Found() {
        String username = "testuser";
        User user = new User();
        user.setUsername(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        Optional<User> result = authService.findByUsername(username);
        assertTrue(result.isPresent());
        assertEquals(username, result.get().getUsername());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    @DisplayName("TC10: findByUsername - Không tìm thấy user")
    void testFindByUsername_NotFound() {
        String username = "nonexistent";
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        Optional<User> result = authService.findByUsername(username);
        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    @DisplayName("TC11: createUser - Tạo user thành công")
    void testCreateUser_Success() {
        UserDto userDto = new UserDto("newuser", "Password123");
        User savedUser = new User();
        savedUser.setUsername("newuser");
        savedUser.setPassword(passwordUtil.hashPassword("Password123"));
        
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

        User result = authService.createUser(userDto);
        assertNotNull(result);
        assertEquals("newuser", result.getUsername());
        assertNotNull(result.getPassword());
        verify(userRepository, times(1)).save(any(User.class));
    }
}
