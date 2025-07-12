package com.petcareclinic.service;

import com.petcareclinic.model.User;
import com.petcareclinic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        try {
            // Set timestamps
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            // Set default values
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("USER");
            }
            if (user.getIsActive() == null) {
                user.setIsActive(true);
            }
            if (user.getEmailVerified() == null) {
                user.setEmailVerified(false);
            }
            if (user.getCountry() == null) {
                user.setCountry("USA");
            }

            return userRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to register user: " + e.getMessage());
        }
    }

    public Optional<User> loginUser(String usernameOrEmail, String password) {
        try {
            Optional<User> userOptional = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);

            if (userOptional.isPresent()) {
                User user = userOptional.get();

                // Simple password comparison (in production, use proper password hashing)
                if (password.equals(user.getPasswordHash())) {
                    // Update last login
                    user.setLastLogin(LocalDateTime.now());
                    userRepository.save(user);
                    return Optional.of(user);
                }
            }

            return Optional.empty();
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User updateUser(Long id, User userDetails) {
        try {
            Optional<User> optionalUser = userRepository.findById(id);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();

                // Update fields (don't update username, email, password here)
                user.setFirstName(userDetails.getFirstName());
                user.setLastName(userDetails.getLastName());
                user.setPhone(userDetails.getPhone());
                user.setAddress(userDetails.getAddress());
                user.setCity(userDetails.getCity());
                user.setState(userDetails.getState());
                user.setZipCode(userDetails.getZipCode());
                user.setCountry(userDetails.getCountry());
                user.setDateOfBirth(userDetails.getDateOfBirth());
                user.setProfileImageUrl(userDetails.getProfileImageUrl());

                // Update timestamp
                user.setUpdatedAt(LocalDateTime.now());

                return userRepository.save(user);
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to update user: " + e.getMessage());
        }
    }
}