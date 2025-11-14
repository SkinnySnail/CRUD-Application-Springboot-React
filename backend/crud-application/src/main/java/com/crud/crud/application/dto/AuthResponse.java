package com.crud.crud.application.dto;

public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private UserDto user;
    private long expiresIn; // in milliseconds

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message, String token, UserDto user, long expiresIn) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
        this.expiresIn = expiresIn;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }
}
