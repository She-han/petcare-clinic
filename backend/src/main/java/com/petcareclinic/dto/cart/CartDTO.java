package com.petcareclinic.dto.cart;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.petcareclinic.model.CartStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private Long id;
    private Long userId;
    private String userName;
    private CartStatus status;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal finalAmount;
    private String couponCode;
    private Integer totalItemsCount; // Changed from int to Integer for consistency
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CartItemDTO> cartItems;
}