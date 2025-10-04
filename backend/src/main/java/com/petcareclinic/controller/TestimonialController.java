package com.petcareclinic.controller;

import com.petcareclinic.model.Testimonial;
import com.petcareclinic.service.TestimonialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/testimonials")
@CrossOrigin(origins = "http://localhost:3000")
public class TestimonialController {

    @Autowired
    private TestimonialService testimonialService;

    // Get all testimonials
    @GetMapping
    public ResponseEntity<List<Testimonial>> getAllTestimonials() {
        try {
            List<Testimonial> testimonials = testimonialService.getAllTestimonials();
            return ResponseEntity.ok(testimonials);
        } catch (Exception e) {
            System.err.println("Error getting testimonials: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get approved testimonials (for public display)
    @GetMapping("/approved")
    public ResponseEntity<?> getApprovedTestimonials() {
        try {
            List<Testimonial> testimonials = testimonialService.getApprovedTestimonials();
            System.out.println("Found " + testimonials.size() + " approved testimonials");
            
            // Convert to DTOs to avoid lazy loading issues
            List<Map<String, Object>> testimonialDTOs = testimonials.stream()
                .map(t -> {
                    Map<String, Object> dto = new HashMap<>();
                    dto.put("id", t.getId());
                    dto.put("customerName", t.getCustomerName());
                    dto.put("customerEmail", t.getCustomerEmail());
                    dto.put("customerImageUrl", t.getCustomerImageUrl());
                    dto.put("rating", t.getRating());
                    dto.put("title", t.getTitle());
                    dto.put("content", t.getContent());
                    dto.put("petName", t.getPetName());
                    dto.put("petType", t.getPetType());
                    dto.put("serviceType", t.getServiceType());
                    dto.put("isApproved", t.getIsApproved());
                    dto.put("isFeatured", t.getIsFeatured());
                    dto.put("approvedAt", t.getApprovedAt());
                    dto.put("createdAt", t.getCreatedAt());
                    dto.put("updatedAt", t.getUpdatedAt());
                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());
                
            return ResponseEntity.ok(testimonialDTOs);
        } catch (Exception e) {
            System.err.println("Error getting approved testimonials: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }

    // Get featured testimonials
    @GetMapping("/featured")
    public ResponseEntity<List<Testimonial>> getFeaturedTestimonials() {
        try {
            List<Testimonial> testimonials = testimonialService.getFeaturedTestimonials();
            return ResponseEntity.ok(testimonials);
        } catch (Exception e) {
            System.err.println("Error getting featured testimonials: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get testimonial by ID
    @GetMapping("/{id}")
    public ResponseEntity<Testimonial> getTestimonialById(@PathVariable Long id) {
        try {
            Optional<Testimonial> testimonial = testimonialService.getTestimonialById(id);
            if (testimonial.isPresent()) {
                return ResponseEntity.ok(testimonial.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error getting testimonial by ID: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create new testimonial
    @PostMapping
    public ResponseEntity<Testimonial> createTestimonial(@RequestBody Testimonial testimonial) {
        try {
            System.out.println("Creating testimonial for: " + testimonial.getCustomerName());
            Testimonial createdTestimonial = testimonialService.createTestimonial(testimonial);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTestimonial);
        } catch (Exception e) {
            System.err.println("Error creating testimonial: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Update testimonial
    @PutMapping("/{id}")
    public ResponseEntity<Testimonial> updateTestimonial(@PathVariable Long id, @RequestBody Testimonial testimonialDetails) {
        try {
            Testimonial updatedTestimonial = testimonialService.updateTestimonial(id, testimonialDetails);
            if (updatedTestimonial != null) {
                return ResponseEntity.ok(updatedTestimonial);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error updating testimonial: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Approve testimonial
    @PutMapping("/{id}/approve")
    public ResponseEntity<Testimonial> approveTestimonial(@PathVariable Long id, @RequestBody java.util.Map<String, Object> data) {
        try {
            Long approvedBy = data.get("approvedBy") != null ? ((Number) data.get("approvedBy")).longValue() : null;
            Testimonial approvedTestimonial = testimonialService.approveTestimonial(id, approvedBy);
            if (approvedTestimonial != null) {
                return ResponseEntity.ok(approvedTestimonial);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error approving testimonial: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Delete testimonial
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable Long id) {
        try {
            boolean deleted = testimonialService.deleteTestimonial(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error deleting testimonial: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
