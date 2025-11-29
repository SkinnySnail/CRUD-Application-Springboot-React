package com.crud.crud.application.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.crud.crud.application.dto.UserDto;
import com.crud.crud.application.entity.User;
import com.crud.crud.application.service.AuthService;
import com.crud.crud.application.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@SuppressWarnings("null")
@WebMvcTest(AuthController.class)
@DisplayName("Login API Integration Tests")
class AuthControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    @DisplayName("POST /auth/login - Thành công")
    void testLoginSuccess() throws Exception {
        UserDto request = new UserDto("testuser", "Test123");
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("Test123");

        when(authService.login(any(UserDto.class))).thenReturn(user);
        when(jwtUtil.generateToken("testuser")).thenReturn("mocked-jwt-token");
        when(jwtUtil.getTokenValidityMilliseconds()).thenReturn(3600000L);

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").value("mocked-jwt-token"));
    }

    @Test
    @DisplayName("POST /auth/login - Sai thông tin đăng nhập")
    void testLoginFailure() throws Exception {
        UserDto request = new UserDto("wronguser", "wrongpass");

        when(authService.login(any(UserDto.class))).thenReturn(null);

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    @DisplayName("POST /auth/login - CORS headers được set đúng")
    void testCorsHeaders() throws Exception {
        UserDto request = new UserDto("testuser", "Test123");
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("Test123");

        when(authService.login(any(UserDto.class))).thenReturn(user);
        when(jwtUtil.generateToken("testuser")).thenReturn("mocked-jwt-token");
        when(jwtUtil.getTokenValidityMilliseconds()).thenReturn(3600000L);

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"));
    }

    @Test
    @DisplayName("OPTIONS /auth/login - CORS preflight request")
    void testCorsPreflight() throws Exception {
        mockMvc.perform(options("/auth/login")
                .header("Origin", "http://localhost:3000")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"));
    }

    @Test
    @DisplayName("POST /auth/login - Validation error: username rỗng (TC_LOGIN_004)")
    void testLoginWithEmptyUsername() throws Exception {
        UserDto request = new UserDto("", "Test123");
        
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Username is required"));
    }

    @Test
    @DisplayName("POST /auth/login - Validation error: password rỗng (TC_LOGIN_005)")
    void testLoginWithEmptyPassword() throws Exception {
        UserDto request = new UserDto("testuser", "");
        
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Password is required"));
    }
}