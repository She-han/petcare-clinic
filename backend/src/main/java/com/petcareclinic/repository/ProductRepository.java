package com.petcareclinic.repository;

import com.petcareclinic.model.Product;
import com.petcareclinic.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find products by category
    List<Product> findByCategory(ProductCategory category);

    // Find active products
    @Query("SELECT p FROM Product p WHERE p.isActive = true")
    List<Product> findActiveProducts();

    // Find featured products
    @Query("SELECT p FROM Product p WHERE p.isFeatured = true AND p.isActive = true")
    List<Product> findFeaturedProducts();

    // Find products by price range
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice AND p.isActive = true")
    List<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);

    // Search products by name or description
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Product> searchProducts(@Param("search") String search);

    // Find products by pet type
    @Query("SELECT p FROM Product p WHERE LOWER(p.petType) = LOWER(:petType) AND p.isActive = true")
    List<Product> findByPetType(@Param("petType") String petType);
}