package com.petcareclinic.repository;

import com.petcareclinic.model.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {

    // Find approved testimonials
    @Query("SELECT t FROM Testimonial t WHERE t.isApproved = true ORDER BY t.createdAt DESC")
    List<Testimonial> findApprovedTestimonials();

    // Find featured testimonials
    @Query("SELECT t FROM Testimonial t WHERE t.isFeatured = true AND t.isApproved = true ORDER BY t.createdAt DESC")
    List<Testimonial> findFeaturedTestimonials();

    // Find testimonials by rating
    @Query("SELECT t FROM Testimonial t WHERE t.rating >= :minRating ORDER BY t.rating DESC, t.createdAt DESC")
    List<Testimonial> findByMinRating(@Param("minRating") Integer minRating);

    // Find testimonials by user
    @Query("SELECT t FROM Testimonial t WHERE t.user.id = :userId ORDER BY t.createdAt DESC")
    List<Testimonial> findByUserId(@Param("userId") Long userId);

    // Find pending testimonials (for admin approval)
    @Query("SELECT t FROM Testimonial t WHERE t.isApproved = false ORDER BY t.createdAt DESC")
    List<Testimonial> findPendingTestimonials();
}