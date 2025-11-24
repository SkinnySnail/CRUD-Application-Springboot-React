package com.crud.crud.application.service;

import com.crud.crud.application.dto.UserDto;
import com.crud.crud.application.entity.User;
import com.crud.crud.application.repository.UserRepository;
import com.crud.crud.application.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordUtil passwordUtil;

    public User login(UserDto userDto) {
        Optional<User> userOptional = userRepository.findByUsername(userDto.getUsername());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Verify password using BCrypt hashing
            if (passwordUtil.verifyPassword(userDto.getPassword(), user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    // Overloaded method for backward compatibility
    public User login(String username, String password) {
        UserDto userDto = new UserDto(username, password);
        return login(userDto);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public User createUser(UserDto userDto) {
        User user = userDto.toEntity();
        // Hash the password before saving
        String hashedPassword = passwordUtil.hashPassword(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
