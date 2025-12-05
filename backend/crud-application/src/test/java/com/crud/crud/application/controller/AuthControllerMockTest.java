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

        when(authService.login(any(UserDto.class))).thenReturn(user);// nghĩa là khi gọi authService.login với bất kỳ UserDto nào thì trả về user
        when(jwtUtil.generateToken("test")).thenReturn("mocked-jwt-token");// nghĩa là khi gọi jwtUtil.generateToken với "test" thì trả về "mocked-jwt-token"
        when(jwtUtil.getTokenValidityMilliseconds()).thenReturn(3600000L);//khi đăng nhập thành công, token sẽ có thời hạn 1 giờ (3600000 milliseconds)

        mockMvc.perform(post("/auth/login") //gửi yêu cầu POST đến endpoint /auth/login với nội dung JSON của request
                .contentType(MediaType.APPLICATION_JSON)// đặt kiểu nội dung là application/json
                .content(objectMapper.writeValueAsString(request)))// chuyển đổi đối tượng request thành chuỗi JSON
                .andExpect(status().isOk());// mong đợi mã trạng thái HTTP 200 OK

        // c) Verify mock interactions
        verify(authService, times(1)).login(any(UserDto.class));// xác minh rằng phương thức login của authService được gọi đúng một lần với bất kỳ UserDto nào
        verify(jwtUtil, times(1)).generateToken("test");// xác minh rằng phương thức generateToken của jwtUtil được gọi đúng một lần với "test"
        verify(jwtUtil, times(1)).getTokenValidityMilliseconds();// xác minh rằng phương thức getTokenValidityMilliseconds của jwtUtil được gọi đúng một lần
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
        verify(jwtUtil, times(0)).generateToken(any(String.class));// nghĩa là xác minh rằng phương thức generateToken của jwtUtil không bao giờ được gọi vì đăng nhập thất bại
    }

    @Test
    @DisplayName("Mock: Login với username null")
    void testLoginWithNullUsername() throws Exception {
        UserDto request = new UserDto(null, "Pass123");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verify(authService, times(0)).login(any(UserDto.class));
    }

    @Test
    @DisplayName("Mock: Login với password null")
    void testLoginWithNullPassword() throws Exception {
        UserDto request = new UserDto("testuser", null);

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verify(authService, times(0)).login(any(UserDto.class));
    }
}