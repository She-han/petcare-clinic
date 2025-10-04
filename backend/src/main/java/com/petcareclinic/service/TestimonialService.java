package com.petcareclinic.service;

import com.petcareclinic.model.Testimonial;
import com.petcareclinic.repository.TestimonialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TestimonialService {

    @Autowired
    private TestimonialRepository testimonialRepository;

    public List<Testimonial> getAllTestimonials() {
        return testimonialRepository.findAll();
    }

    public List<Testimonial> getApprovedTestimonials() {
        return testimonialRepository.findByIsApprovedTrue();
    }

    public List<Testimonial> getFeaturedTestimonials() {
        return testimonialRepository.findByIsFeaturedTrue();
    }

    public Optional<Testimonial> getTestimonialById(Long id) {
        return testimonialRepository.findById(id);
    }

    public Testimonial createTestimonial(Testimonial testimonial) {
        try {
            testimonial.setCreatedAt(LocalDateTime.now());
            testimonial.setUpdatedAt(LocalDateTime.now());
            
            // Set defaults if not provided
            if (testimonial.getIsApproved() == null) {
                testimonial.setIsApproved(false);
            }
            if (testimonial.getIsFeatured() == null) {
                testimonial.setIsFeatured(false);
            }

            return testimonialRepository.save(testimonial);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create testimonial: " + e.getMessage());
        }
    }

    public Testimonial updateTestimonial(Long id, Testimonial testimonialDetails) {
        try {
            Optional<Testimonial> optionalTestimonial = testimonialRepository.findById(id);
            if (optionalTestimonial.isPresent()) {
                Testimonial testimonial = optionalTestimonial.get();

                testimonial.setCustomerName(testimonialDetails.getCustomerName());
                testimonial.setCustomerEmail(testimonialDetails.getCustomerEmail());
                testimonial.setCustomerImageUrl(testimonialDetails.getCustomerImageUrl());
                testimonial.setRating(testimonialDetails.getRating());
                testimonial.setTitle(testimonialDetails.getTitle());
                testimonial.setContent(testimonialDetails.getContent());
                testimonial.setPetName(testimonialDetails.getPetName());
                testimonial.setPetType(testimonialDetails.getPetType());
                testimonial.setServiceType(testimonialDetails.getServiceType());
                testimonial.setUpdatedAt(LocalDateTime.now());

                return testimonialRepository.save(testimonial);
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to update testimonial: " + e.getMessage());
        }
    }

    public Testimonial approveTestimonial(Long id, Long approvedBy) {
        try {
            Optional<Testimonial> optionalTestimonial = testimonialRepository.findById(id);
            if (optionalTestimonial.isPresent()) {
                Testimonial testimonial = optionalTestimonial.get();
                testimonial.setIsApproved(true);
                testimonial.setApprovedAt(LocalDateTime.now());
                testimonial.setUpdatedAt(LocalDateTime.now());

                return testimonialRepository.save(testimonial);
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to approve testimonial: " + e.getMessage());
        }
    }

    public boolean deleteTestimonial(Long id) {
        try {
            if (testimonialRepository.existsById(id)) {
                testimonialRepository.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
