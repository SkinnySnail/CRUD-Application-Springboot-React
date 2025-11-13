package com.crud.crud.application.util;

import com.crud.crud.application.dto.UserDto;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

public class UserValidation {

    // Regex patterns
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-zA-Z0-9._-]+$");
    private static final Pattern PASSWORD_COMPLEXITY_PATTERN = Pattern.compile("^(?=.*[a-zA-Z])(?=.*\\d).+$");

    public static Map<String, String> validateUser(UserDto userDto) {
        Map<String, String> errors = new HashMap<>();

        // Validate username
        if (userDto.getUsername() == null || userDto.getUsername().trim().isEmpty()) {
            errors.put("username", "Username is required");
        } else {
            String username = userDto.getUsername().trim();

            // Check length
            if (username.length() < 3) {
                errors.put("username", "Username must be at least 3 characters");
            } else if (username.length() > 50) {
                errors.put("username", "Username must not exceed 50 characters");
            }

            // Check valid characters
            if (!USERNAME_PATTERN.matcher(username).matches()) {
                errors.put("username",
                        "Username can only contain letters, numbers, dots (.), hyphens (-), and underscores (_)");
            }

            // Check for spaces
            if (username.contains(" ")) {
                errors.put("username", "Username cannot contain spaces");
            }
        }

        // Validate password
        if (userDto.getPassword() == null || userDto.getPassword().isEmpty()) {
            errors.put("password", "Password is required");
        } else {
            String password = userDto.getPassword();

            // Check length
            if (password.length() < 6) {
                errors.put("password", "Password must be at least 6 characters");
            } else if (password.length() > 100) {
                errors.put("password", "Password must not exceed 100 characters");
            }

            // Check complexity (at least one letter and one number)
            if (!PASSWORD_COMPLEXITY_PATTERN.matcher(password).matches()) {
                errors.put("password", "Password must contain at least one letter and one number");
            }

            // Check if password contains username
            if (userDto.getUsername() != null && !userDto.getUsername().isEmpty()) {
                if (password.toLowerCase().contains(userDto.getUsername().toLowerCase())) {
                    errors.put("password", "Password cannot contain username");
                }
            }
        }

        return errors;
    }

    public static boolean isValidUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return false;
        }

        String trimmedUsername = username.trim();
        return trimmedUsername.length() >= 3
                && trimmedUsername.length() <= 50
                && USERNAME_PATTERN.matcher(trimmedUsername).matches()
                && !trimmedUsername.contains(" ");
    }

    public static boolean isValidPassword(String password, String username) {
        if (password == null || password.isEmpty()) {
            return false;
        }

        boolean lengthValid = password.length() >= 6 && password.length() <= 100;
        boolean complexityValid = PASSWORD_COMPLEXITY_PATTERN.matcher(password).matches();
        boolean notContainsUsername = username == null || !password.toLowerCase().contains(username.toLowerCase());

        return lengthValid && complexityValid && notContainsUsername;
    }
}
