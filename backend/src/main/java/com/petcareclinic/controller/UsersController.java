package com.petcareclinic.controller;

import com.petcareclinic.model.User;
import com.petcareclinic.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UsersController {

    @Autowired
    private UserService userService;

    // Get all users
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", users);
            response.put("message", "Users retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error getting all users: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve users: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        try {
            Optional<User> user = userService.getUserById(id);
            
            if (user.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", user.get());
                response.put("message", "User retrieved successfully");
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error getting user by ID: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Create new user
    @PostMapping
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody User user) {
        try {
            // Check if username or email already exists
            if (userService.existsByUsername(user.getUsername())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Username already exists");
                return ResponseEntity.badRequest().body(response);
            }

            if (userService.existsByEmail(user.getEmail())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }

            User createdUser = userService.createUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", createdUser);
            response.put("message", "User created successfully");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            System.err.println("Error creating user: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUserAdmin(id, userDetails);
            
            if (updatedUser != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", updatedUser);
                response.put("message", "User updated successfully");
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error updating user: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        try {
            boolean deleted = userService.deleteUser(id);
            
            if (deleted) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "User deleted successfully");
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error deleting user: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Search users
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchUsers(@RequestParam String q) {
        try {
            List<User> users = userService.searchUsers(q);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", users);
            response.put("message", "Search completed successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error searching users: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to search users: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}