package com.petcareclinic.service;

import com.petcareclinic.model.Veterinarian;
import com.petcareclinic.repository.VeterinarianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VeterinarianService {

    @Autowired
    private VeterinarianRepository veterinarianRepository;

    public List<Veterinarian> getAllVeterinarians() {
        return veterinarianRepository.findAll();
    }

    public Optional<Veterinarian> getVeterinarianById(Long id) {
        return veterinarianRepository.findById(id);
    }

    // Remove this method since we don't have user_id
    // public Optional<Veterinarian> getVeterinarianByUserId(Long userId) {
    //     return veterinarianRepository.findByUserId(userId);
    // }

    public Optional<Veterinarian> getVeterinarianByEmail(String email) {
        return veterinarianRepository.findByEmail(email);
    }

    public Optional<Veterinarian> getVeterinarianByLicenseNumber(String licenseNumber) {
        return veterinarianRepository.findByLicenseNumber(licenseNumber);
    }

    public Veterinarian createVeterinarian(Veterinarian veterinarian) {
        try {
            // Set timestamps
            veterinarian.setCreatedAt(LocalDateTime.now());
            veterinarian.setUpdatedAt(LocalDateTime.now());

            // Set default values if null
            if (veterinarian.getIsAvailable() == null) {
                veterinarian.setIsAvailable(true);
            }
            if (veterinarian.getTotalReviews() == null) {
                veterinarian.setTotalReviews(0);
            }
            if (veterinarian.getYearsOfExperience() == null) {
                veterinarian.setYearsOfExperience(0);
            }

            return veterinarianRepository.save(veterinarian);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create veterinarian: " + e.getMessage());
        }
    }

    public Veterinarian updateVeterinarian(Long id, Veterinarian veterinarianDetails) {
        try {
            Optional<Veterinarian> optionalVeterinarian = veterinarianRepository.findById(id);
            if (optionalVeterinarian.isPresent()) {
                Veterinarian veterinarian = optionalVeterinarian.get();

                // Update all fields (removed userId, added new fields)
                veterinarian.setFullName(veterinarianDetails.getFullName());
                veterinarian.setEmail(veterinarianDetails.getEmail());
                veterinarian.setPhoneNumber(veterinarianDetails.getPhoneNumber());
                veterinarian.setLicenseNumber(veterinarianDetails.getLicenseNumber());
                veterinarian.setSpecialization(veterinarianDetails.getSpecialization());
                veterinarian.setYearsOfExperience(veterinarianDetails.getYearsOfExperience());
                veterinarian.setEducation(veterinarianDetails.getEducation());
                veterinarian.setBio(veterinarianDetails.getBio());
                veterinarian.setConsultationFee(veterinarianDetails.getConsultationFee());
                veterinarian.setAvailableFrom(veterinarianDetails.getAvailableFrom());
                veterinarian.setAvailableTo(veterinarianDetails.getAvailableTo());
                veterinarian.setWorkingDays(veterinarianDetails.getWorkingDays());
                veterinarian.setIsAvailable(veterinarianDetails.getIsAvailable());
                veterinarian.setRating(veterinarianDetails.getRating());
                veterinarian.setTotalReviews(veterinarianDetails.getTotalReviews());
                veterinarian.setImageUrl(veterinarianDetails.getImageUrl());

                // Update timestamp
                veterinarian.setUpdatedAt(LocalDateTime.now());

                return veterinarianRepository.save(veterinarian);
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to update veterinarian: " + e.getMessage());
        }
    }

    public boolean deleteVeterinarian(Long id) {
        try {
            if (veterinarianRepository.existsById(id)) {
                veterinarianRepository.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Veterinarian> searchVeterinarians(String query) {
        return veterinarianRepository.searchVeterinarians(query);
    }

    public List<Veterinarian> getVeterinariansBySpecialization(String specialization) {
        return veterinarianRepository.findBySpecialization(specialization);
    }

    public List<Veterinarian> getAvailableVeterinarians() {
        return veterinarianRepository.findByIsAvailableTrue();
    }

    public List<String> getAllSpecializations() {
        return veterinarianRepository.findAllSpecializations();
    }

    public List<Veterinarian> getVeterinariansByMinimumExperience(Integer minYears) {
        return veterinarianRepository.findByMinimumExperience(minYears);
    }

    public List<Veterinarian> getVeterinariansByMinimumRating(Double minRating) {
        return veterinarianRepository.findByMinimumRating(minRating);
    }
}