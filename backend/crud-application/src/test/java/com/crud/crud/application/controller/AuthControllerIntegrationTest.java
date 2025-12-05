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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
@WebMvcTest(AuthController.class) //AuthController là controller đăng nhập,controller này được test bằng MockMvc
// request/response nghĩa là test các endpoint của controller bằng MockMvc, request là dữ liệu gửi lên server, response là dữ liệu nhận từ server   
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
        when(jwtUtil.generateToken("testuser")).thenReturn("mocked-jwt-token");// khi generate token, sẽ trả về "mocked-jwt-token",generate token là để tạo token cho user
        when(jwtUtil.getTokenValidityMilliseconds()).thenReturn(3600000L);

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk()) //khi login thành công, sẽ trả về status 200,status 200 là status thành công
                .andExpect(jsonPath("$.success").value(true)) //khi login thành công, sẽ trả về success là true
                .andExpect(jsonPath("$.token").value("mocked-jwt-token")); //khi login thành công, sẽ trả về token là "mocked-jwt-token"
    }

    @Test
    @DisplayName("POST /auth/login - Sai thông tin đăng nhập")
    void testLoginFailure() throws Exception {
        UserDto request = new UserDto("wronguser", "wrongpass");

        when(authService.login(any(UserDto.class))).thenReturn(null);

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON) //contentType là kiểu dữ liệu gửi lên server,APPLICATION_JSON là kiểu dữ liệu JSON
                .content(objectMapper.writeValueAsString(request))) //content là dữ liệu gửi lên server,objectMapper.writeValueAsString(request) là chuyển đổi dữ liệu request thành dữ liệu JSON
                .andExpect(status().isUnauthorized()) //khi login thất bại, sẽ trả về status 401,status 401 là status thất bại
                .andExpect(jsonPath("$.success").value(false)) //khi login thất bại, sẽ trả về success là false
                .andExpect(jsonPath("$.token").doesNotExist()); //khi login thất bại, sẽ trả về token không tồn tại
    }

    @Test
    @DisplayName("POST /auth/login - CORS headers được set đúng") //CORS headers được set đúng là để cho phép frontend gọi API backend
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
                .header("Origin", "http://localhost:3000")) //header là thông tin gửi lên server,Origin là domain gửi request lên server
                .andExpect(status().isOk()) 
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000")); //header là thông tin gửi lên server,Access-Control-Allow-Origin là domain cho phép gọi API
    }

    @Test
    @DisplayName("OPTIONS /auth/login - CORS preflight request") // CORS preflight request là request để kiểm tra xem server có cho phép gọi API không
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
        
        mockMvc.perform(post("/auth/login") //post("/auth/login") là gửi request đến endpoint "/auth/login"
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

    @Test
    @DisplayName("POST /auth/register - Đăng ký thành công")
    void testRegisterSuccess() throws Exception {
        UserDto request = new UserDto("newuser", "Pass123");
        User newUser = new User("newuser", "hashedPass123");
        newUser.setId(1L);

        when(authService.existsByUsername("newuser")).thenReturn(false);
        when(authService.createUser(any(UserDto.class))).thenReturn(newUser);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User registered successfully"));
    }

    @Test
    @DisplayName("POST /auth/register - Username đã tồn tại")
    void testRegisterUsernameExists() throws Exception {
        UserDto request = new UserDto("existinguser", "Pass123");

        when(authService.existsByUsername("existinguser")).thenReturn(true);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Username already exists"));
    }

    @Test
    @DisplayName("POST /auth/register - Validation error: username quá ngắn")
    void testRegisterUsernameShort() throws Exception {
        UserDto request = new UserDto("ab", "Pass123");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }

    @Test
    @DisplayName("GET /auth/check-username/{username} - Username có sẵn")
    void testCheckUsernameAvailable() throws Exception {
        when(authService.existsByUsername("newuser")).thenReturn(false);

        mockMvc.perform(get("/auth/check-username/newuser")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(false))
                .andExpect(jsonPath("$.available").value(true));
    }

    @Test
    @DisplayName("GET /auth/check-username/{username} - Username đã tồn tại")
    void testCheckUsernameExists() throws Exception {
        when(authService.existsByUsername("existinguser")).thenReturn(true);

        mockMvc.perform(get("/auth/check-username/existinguser")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(true))
                .andExpect(jsonPath("$.available").value(false));
    }
}