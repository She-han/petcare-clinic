package com.petcareclinic.service;

import com.petcareclinic.model.Product;
import com.petcareclinic.model.ProductCategory;
import com.petcareclinic.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get product by ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Get active products
    public List<Product> getActiveProducts() {
        return productRepository.findActiveProducts();
    }

    // Get featured products
    public List<Product> getFeaturedProducts() {
        return productRepository.findFeaturedProducts();
    }

    // Create new product
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Update product
    public Product updateProduct(Long id, Product productDetails) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
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

            return productRepository.save(product);
        }
        return null;
    }

    // Delete product
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Search products
    public List<Product> searchProducts(String search) {
        return productRepository.searchProducts(search);
    }

    // Get products by category
    public List<Product> getProductsByCategory(ProductCategory category) {
        return productRepository.findByCategory(category);
    }

    // Get products by price range
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceRange(minPrice, maxPrice);
    }
}