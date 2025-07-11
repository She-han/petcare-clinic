package com.petcareclinic.service;

import com.petcareclinic.model.Product;
import com.petcareclinic.model.ProductCategory;
import com.petcareclinic.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product) {
        try {
            // Set timestamps
            product.setCreatedAt(LocalDateTime.now());
            product.setUpdatedAt(LocalDateTime.now());

            // Set default values if null
            if (product.getIsActive() == null) {
                product.setIsActive(true);
            }
            if (product.getIsFeatured() == null) {
                product.setIsFeatured(false);
            }
            if (product.getRating() == null) {
                product.setRating(0.0);
            }
            if (product.getTotalReviews() == null) {
                product.setTotalReviews(0);
            }

            return productRepository.save(product);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create product: " + e.getMessage());
        }
    }

    public Product updateProduct(Long id, Product productDetails) {
        try {
            Optional<Product> optionalProduct = productRepository.findById(id);
            if (optionalProduct.isPresent()) {
                Product product = optionalProduct.get();

                // Update fields
                product.setName(productDetails.getName());
                product.setDescription(productDetails.getDescription());
                product.setShortDescription(productDetails.getShortDescription());
                product.setCategory(productDetails.getCategory());
                product.setBrand(productDetails.getBrand());
                product.setPrice(productDetails.getPrice());
                product.setDiscountPrice(productDetails.getDiscountPrice());
                product.setStockQuantity(productDetails.getStockQuantity());
                product.setSku(productDetails.getSku());
                product.setWeight(productDetails.getWeight());
                product.setDimensions(productDetails.getDimensions());
                product.setAgeRange(productDetails.getAgeRange());
                product.setPetType(productDetails.getPetType());
                product.setIngredients(productDetails.getIngredients());
                product.setUsageInstructions(productDetails.getUsageInstructions());
                product.setImageUrl(productDetails.getImageUrl());
                product.setIsActive(productDetails.getIsActive());
                product.setIsFeatured(productDetails.getIsFeatured());
                product.setRating(productDetails.getRating());
                product.setTotalReviews(productDetails.getTotalReviews());

                // Update timestamp
                product.setUpdatedAt(LocalDateTime.now());

                return productRepository.save(product);
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to update product: " + e.getMessage());
        }
    }

    public boolean deleteProduct(Long id) {
        try {
            if (productRepository.existsById(id)) {
                productRepository.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrBrandContainingIgnoreCase(
                query, query, query);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrue();
    }
}