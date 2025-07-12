package com.petcareclinic.controller;

import com.petcareclinic.model.Veterinarian;
import com.petcareclinic.service.VeterinarianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/veterinarians")
@CrossOrigin(origins = "http://localhost:3000")
public class VeterinarianController {

    @Autowired
    private VeterinarianService veterinarianService;

    // Get all veterinarians
    @GetMapping
    public ResponseEntity<List<Veterinarian>> getAllVeterinarians() {
        try {
            List<Veterinarian> veterinarians = veterinarianService.getAllVeterinarians();
            return ResponseEntity.ok(veterinarians);
        } catch (Exception e) {
            System.err.println("Error getting veterinarians: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get veterinarian by ID
    @GetMapping("/{id}")
    public ResponseEntity<Veterinarian> getVeterinarianById(@PathVariable Long id) {
        try {
            Optional<Veterinarian> veterinarian = veterinarianService.getVeterinarianById(id);
            if (veterinarian.isPresent()) {
                return ResponseEntity.ok(veterinarian.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error getting veterinarian by ID: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Remove this endpoint since we don't have user_id
    // @GetMapping("/user/{userId}")
    // public ResponseEntity<Veterinarian> getVeterinarianByUserId(@PathVariable Long userId)

    // Get veterinarian by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Veterinarian> getVeterinarianByEmail(@PathVariable String email) {
        try {
            Optional<Veterinarian> veterinarian = veterinarianService.getVeterinarianByEmail(email);
            if (veterinarian.isPresent()) {
                return ResponseEntity.ok(veterinarian.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error getting veterinarian by email: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create new veterinarian
    @PostMapping
    public ResponseEntity<Veterinarian> createVeterinarian(@RequestBody Veterinarian veterinarian) {
        try {
            System.out.println("Creating veterinarian: " + veterinarian.getFullName());
            System.out.println("Veterinarian email: " + veterinarian.getEmail());
            System.out.println("Veterinarian specialization: " + veterinarian.getSpecialization());
            System.out.println("Veterinarian consultation fee: " + veterinarian.getConsultationFee());

            Veterinarian createdVeterinarian = veterinarianService.createVeterinarian(veterinarian);
            System.out.println("Veterinarian created successfully with ID: " + createdVeterinarian.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(createdVeterinarian);
        } catch (Exception e) {
            System.err.println("Error creating veterinarian: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Update veterinarian
    @PutMapping("/{id}")
    public ResponseEntity<Veterinarian> updateVeterinarian(@PathVariable Long id, @RequestBody Veterinarian veterinarianDetails) {
        try {
            System.out.println("Updating veterinarian with ID: " + id);
            System.out.println("Veterinarian name: " + veterinarianDetails.getFullName());

            Veterinarian updatedVeterinarian = veterinarianService.updateVeterinarian(id, veterinarianDetails);
            if (updatedVeterinarian != null) {
                System.out.println("Veterinarian updated successfully");
                return ResponseEntity.ok(updatedVeterinarian);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error updating veterinarian: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Delete veterinarian
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVeterinarian(@PathVariable Long id) {
        try {
            boolean deleted = veterinarianService.deleteVeterinarian(id);
            if (deleted) {
                System.out.println("Veterinarian deleted successfully");
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error deleting veterinarian: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Search veterinarians
    @GetMapping("/search")
    public ResponseEntity<List<Veterinarian>> searchVeterinarians(@RequestParam String q) {
        try {
            List<Veterinarian> veterinarians = veterinarianService.searchVeterinarians(q);
            return ResponseEntity.ok(veterinarians);
        } catch (Exception e) {
            System.err.println("Error searching veterinarians: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get veterinarians by specialization
    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<Veterinarian>> getVeterinariansBySpecialization(@PathVariable String specialization) {
        try {
            List<Veterinarian> veterinarians = veterinarianService.getVeterinariansBySpecialization(specialization);
            return ResponseEntity.ok(veterinarians);
        } catch (Exception e) {
            System.err.println("Error getting veterinarians by specialization: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get available veterinarians
    @GetMapping("/available")
    public ResponseEntity<List<Veterinarian>> getAvailableVeterinarians() {
        try {
            List<Veterinarian> veterinarians = veterinarianService.getAvailableVeterinarians();
            return ResponseEntity.ok(veterinarians);
        } catch (Exception e) {
            System.err.println("Error getting available veterinarians: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all specializations
    @GetMapping("/specializations")
    public ResponseEntity<List<String>> getAllSpecializations() {
        try {
            List<String> specializations = veterinarianService.getAllSpecializations();
            return ResponseEntity.ok(specializations);
        } catch (Exception e) {
            System.err.println("Error getting specializations: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}