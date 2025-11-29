package com.crud.crud.application.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.crud.crud.application.dto.UserDto;
import com.crud.crud.application.entity.User;
import com.crud.crud.application.service.AuthService;
import com.crud.crud.application.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@SuppressWarnings("null")
@WebMvcTest(AuthController.class)
class AuthControllerMockTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Mock: Controller với mocked service success")
    void testLoginWithMockedService() throws Exception {
        UserDto request = new UserDto("test", "Pass123");
        User user = new User();
        user.setId(1L);
        user.setUsername("test");
        user.setPassword("Pass123");

        when(authService.login(any(UserDto.class))).thenReturn(user);
        when(jwtUtil.generateToken("test")).thenReturn("mocked-jwt-token");
        when(jwtUtil.getTokenValidityMilliseconds()).thenReturn(3600000L);

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // c) Verify mock interactions
        verify(authService, times(1)).login(any(UserDto.class));
        verify(jwtUtil, times(1)).generateToken("test");
        verify(jwtUtil, times(1)).getTokenValidityMilliseconds();
    }

    @Test
    @DisplayName("Mock: Controller với mocked service failure")
    void testLoginWithMockedServiceFailure() throws Exception {
        UserDto request = new UserDto("wronguser", "wrongpass");

        when(authService.login(any(UserDto.class))).thenReturn(null);

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());

        // Verify mock interactions
        verify(authService, times(1)).login(any(UserDto.class));
        verify(jwtUtil, times(0)).generateToken(any(String.class));
    }
}