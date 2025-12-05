package com.crud.crud.application.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import com.crud.crud.application.filter.JwtRequestFilter;

import jakarta.servlet.FilterChain;

@DisplayName("JwtUtil Tests")
class JwtUtilTest {
    private final JwtUtil jwtUtil = new JwtUtil();
    private JwtRequestFilter jwtRequestFilter;

    @BeforeEach
    void setUp() {
        jwtRequestFilter = new JwtRequestFilter();
        // Inject jwtUtil into filter using reflection
        try {
            java.lang.reflect.Field field = JwtRequestFilter.class.getDeclaredField("jwtUtil");
            field.setAccessible(true);
            field.set(jwtRequestFilter, jwtUtil);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

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

    // ===== JWT FILTER TESTS =====
    @Test
    @DisplayName("Filter: Valid JWT token sets username in request")
    void testFilterWithValidToken() throws Exception {
        String username = "testuser";
        String token = jwtUtil.generateToken(username);
        
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain filterChain = mock(FilterChain.class);
        
        request.addHeader("Authorization", "Bearer " + token);
        
        jwtRequestFilter.doFilter(request, response, filterChain);
        
        assertEquals(username, request.getAttribute("username"));
    }

    @Test
    @DisplayName("Filter: Missing Authorization header")
    void testFilterWithoutAuthHeader() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain filterChain = mock(FilterChain.class);
        
        jwtRequestFilter.doFilter(request, response, filterChain);
        
        assertNull(request.getAttribute("username"));
    }

    @Test
    @DisplayName("Filter: Invalid token format")
    void testFilterWithInvalidToken() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain filterChain = mock(FilterChain.class);
        
        request.addHeader("Authorization", "Bearer invalid.token.format");
        
        jwtRequestFilter.doFilter(request, response, filterChain);
        
        assertNull(request.getAttribute("username"));
    }

    @Test
    @DisplayName("Filter: Authorization without Bearer prefix")
    void testFilterWithoutBearerPrefix() throws Exception {
        String token = jwtUtil.generateToken("testuser");
        
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain filterChain = mock(FilterChain.class);
        
        request.addHeader("Authorization", "Basic " + token);
        
        jwtRequestFilter.doFilter(request, response, filterChain);
        
        assertNull(request.getAttribute("username"));
    }

    @Test
    @DisplayName("Filter: Expired or tampered token")
    void testFilterWithTamperedToken() throws Exception {
        String token = jwtUtil.generateToken("user1");
        String tamperedToken = token + "tampered";
        
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain filterChain = mock(FilterChain.class);
        
        request.addHeader("Authorization", "Bearer " + tamperedToken);
        
        jwtRequestFilter.doFilter(request, response, filterChain);
        
        assertNull(request.getAttribute("username"));
    }
}