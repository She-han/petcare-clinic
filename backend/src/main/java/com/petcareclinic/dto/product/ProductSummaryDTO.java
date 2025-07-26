package com.petcareclinic.dto.product;


import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.petcareclinic.model.ProductCategory;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryDTO {

    private Long id;
    private String name;
    private BigDecimal price;
    private String imageUrl;
    private ProductCategory category;
    private Integer stockQuantity;
    private String brand;
    private Double rating;

    // Helper method to check if product is in stock
    public boolean isInStock() {
        return stockQuantity != null && stockQuantity > 0;
    }

    // Helper method to check if stock is low (less than 10)
    public boolean isLowStock() {
        return stockQuantity != null && stockQuantity > 0 && stockQuantity <= 10;
    }

    // Helper method to get stock status
    public String getStockStatus() {
        if (stockQuantity == null || stockQuantity == 0) {
            return "OUT_OF_STOCK";
        } else if (stockQuantity <= 10) {
            return "LOW_STOCK";
        } else {
            return "IN_STOCK";
        }
    }
}