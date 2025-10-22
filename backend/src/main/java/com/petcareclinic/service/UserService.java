package com.petcareclinic.service;

import com.petcareclinic.model.User;
import com.petcareclinic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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
            System.out.println("UserService: Looking up user: " + usernameOrEmail);
            Optional<User> userOptional = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                System.out.println("UserService: User found: " + user.getUsername());
                System.out.println("UserService: Stored hash: " + user.getPasswordHash());
                System.out.println("UserService: Input password: " + password);
                
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                
                // Verify password using BCrypt matches method
                // This compares the plain password with the stored hash
                boolean passwordMatches = encoder.matches(password, user.getPasswordHash());
                System.out.println("UserService: Password matches: " + passwordMatches);
                
                if (passwordMatches) {
                    System.out.println("UserService: Login successful for user: " + user.getUsername());
                    // Update last login
                    user.setLastLogin(LocalDateTime.now());
                    userRepository.save(user);
                    return Optional.of(user);
                } else {
                    System.out.println("UserService: Password verification failed");
                }
            } else {
                System.out.println("UserService: User not found: " + usernameOrEmail);
            }

            return Optional.empty();
        } catch (Exception e) {
            System.err.println("UserService: Login error: " + e.getMessage());
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

    // Get all users
    public List<User> getAllUsers() {
        try {
            return userRepository.findAll();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to get all users: " + e.getMessage());
        }
    }

    // Create new user (for admin purposes)
    public User createUser(User user) {
        try {
            // Set timestamps
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            // Set default values if not provided
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("USER");
            }
            if (user.getIsActive() == null) {
                user.setIsActive(true);
            }
            if (user.getEmailVerified() == null) {
                user.setEmailVerified(false);
            }
            if (user.getCountry() == null || user.getCountry().isEmpty()) {
                user.setCountry("USA");
            }

            return userRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create user: " + e.getMessage());
        }
    }

    // Update user (admin version with more permissions)
    public User updateUserAdmin(Long id, User userDetails) {
        try {
            Optional<User> optionalUser = userRepository.findById(id);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();

                // Update all fields that can be modified
                if (userDetails.getFirstName() != null) {
                    user.setFirstName(userDetails.getFirstName());
                }
                if (userDetails.getLastName() != null) {
                    user.setLastName(userDetails.getLastName());
                }
                if (userDetails.getEmail() != null) {
                    user.setEmail(userDetails.getEmail());
                }
                if (userDetails.getUsername() != null) {
                    user.setUsername(userDetails.getUsername());
                }
                if (userDetails.getPhone() != null) {
                    user.setPhone(userDetails.getPhone());
                }
                if (userDetails.getAddress() != null) {
                    user.setAddress(userDetails.getAddress());
                }
                if (userDetails.getCity() != null) {
                    user.setCity(userDetails.getCity());
                }
                if (userDetails.getState() != null) {
                    user.setState(userDetails.getState());
                }
                if (userDetails.getZipCode() != null) {
                    user.setZipCode(userDetails.getZipCode());
                }
                if (userDetails.getCountry() != null) {
                    user.setCountry(userDetails.getCountry());
                }
                if (userDetails.getRole() != null) {
                    user.setRole(userDetails.getRole());
                }
                if (userDetails.getIsActive() != null) {
                    user.setIsActive(userDetails.getIsActive());
                }
                if (userDetails.getEmailVerified() != null) {
                    user.setEmailVerified(userDetails.getEmailVerified());
                }
                if (userDetails.getDateOfBirth() != null) {
                    user.setDateOfBirth(userDetails.getDateOfBirth());
                }
                if (userDetails.getProfileImageUrl() != null) {
                    user.setProfileImageUrl(userDetails.getProfileImageUrl());
                }

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

    // Delete user
    public boolean deleteUser(Long id) {
        try {
            if (userRepository.existsById(id)) {
                userRepository.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to delete user: " + e.getMessage());
        }
    }

    // Search users by name, email, or username
    public List<User> searchUsers(String query) {
        try {
            return userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                query, query, query, query
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to search users: " + e.getMessage());
        }
    }
}