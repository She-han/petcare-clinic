package com.petcareclinic.repository;

import com.petcareclinic.model.Veterinarian;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VeterinarianRepository extends JpaRepository<Veterinarian, Long> {

    // Remove this method since we don't have user_id anymore
    // Optional<Veterinarian> findByUserId(Long userId);

    Optional<Veterinarian> findByEmail(String email);

    Optional<Veterinarian> findByLicenseNumber(String licenseNumber);

    List<Veterinarian> findBySpecialization(String specialization);

    List<Veterinarian> findByIsAvailableTrue();

    @Query("SELECT v FROM Veterinarian v WHERE v.isAvailable = true")
    List<Veterinarian> findAllAvailableVeterinarians();

    @Query("SELECT v FROM Veterinarian v WHERE " +
            "LOWER(v.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(v.specialization) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(v.licenseNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(v.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(v.bio) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Veterinarian> searchVeterinarians(@Param("query") String query);

    @Query("SELECT v FROM Veterinarian v WHERE v.yearsOfExperience >= :minYears")
    List<Veterinarian> findByMinimumExperience(@Param("minYears") Integer minYears);

    @Query("SELECT v FROM Veterinarian v WHERE v.rating >= :minRating")
    List<Veterinarian> findByMinimumRating(@Param("minRating") Double minRating);

    @Query("SELECT DISTINCT v.specialization FROM Veterinarian v WHERE v.specialization IS NOT NULL")
    List<String> findAllSpecializations();
}