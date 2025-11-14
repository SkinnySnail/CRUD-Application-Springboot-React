package com.crud.crud.application.controller;

import com.crud.crud.application.dto.AuthResponse;
import com.crud.crud.application.dto.UserDto;
import com.crud.crud.application.entity.User;
import com.crud.crud.application.service.UserService;
import com.crud.crud.application.util.JwtUtil;
import com.crud.crud.application.util.UserValidation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto userDto) {
        // Validate input
        if (userDto.getUsername() == null || userDto.getUsername().trim().isEmpty()) {
            AuthResponse response = new AuthResponse();
            response.setSuccess(false);
            response.setMessage("Username is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (userDto.getPassword() == null || userDto.getPassword().isEmpty()) {
            AuthResponse response = new AuthResponse();
            response.setSuccess(false);
            response.setMessage("Password is required");
            return ResponseEntity.badRequest().body(response);
        }

        // Attempt login
        User user = userService.login(userDto.getUsername(), userDto.getPassword());

        if (user != null) {
            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername());
            long expiresIn = jwtUtil.getTokenValidityMilliseconds(); // in milliseconds

            AuthResponse response = new AuthResponse(
                    true,
                    "Login successful",
                    token,
                    UserDto.fromEntity(user),
                    expiresIn);
            return ResponseEntity.ok(response);
        } else {
            AuthResponse response = new AuthResponse();
            response.setSuccess(false);
            response.setMessage("Invalid username or password");
            return ResponseEntity.status(401).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        Map<String, Object> response = new HashMap<>();

        // Validate user input
        Map<String, String> validationErrors = UserValidation.validateUser(userDto);
        if (!validationErrors.isEmpty()) {
            response.put("success", false);
            response.put("message", "Validation failed");
            response.put("errors", validationErrors);
            return ResponseEntity.badRequest().body(response);
        }

        // Check if username already exists
        if (userService.existsByUsername(userDto.getUsername())) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }

        // Create new user
        User newUser = userService.createUser(userDto.toEntity());
        response.put("success", true);
        response.put("message", "User registered successfully");
        response.put("user", UserDto.fromEntity(newUser));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<?> checkUsername(@PathVariable String username) {
        Map<String, Object> response = new HashMap<>();
        boolean exists = userService.existsByUsername(username);

        response.put("exists", exists);
        response.put("available", !exists);

        return ResponseEntity.ok(response);
    }
}
