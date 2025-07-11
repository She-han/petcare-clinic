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

    // Find veterinarian by user ID
    Optional<Veterinarian> findByUserId(Long userId);

    // Find available veterinarians
    @Query("SELECT v FROM Veterinarian v WHERE v.isAvailable = true")
    List<Veterinarian> findAvailableVeterinarians();

    // Find veterinarians by specialization
    @Query("SELECT v FROM Veterinarian v WHERE LOWER(v.specialization) LIKE LOWER(CONCAT('%', :specialization, '%'))")
    List<Veterinarian> findBySpecialization(@Param("specialization") String specialization);

    // Find veterinarians with high ratings
    @Query("SELECT v FROM Veterinarian v WHERE v.rating >= :minRating ORDER BY v.rating DESC")
    List<Veterinarian> findByMinRating(@Param("minRating") java.math.BigDecimal minRating);
}