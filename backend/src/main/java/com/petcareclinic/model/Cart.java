package com.petcareclinic.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "carts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Fix the enum mapping for PostgreSQL
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "cart_status")
    private CartStatus status;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount;

    @Column(name = "final_amount", precision = 10, scale = 2)
    private BigDecimal finalAmount;

    @Column(name = "coupon_code")
    private String couponCode;

    @Column(name = "session_id")
    private String sessionId;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CartItem> cartItems = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper methods
    public void calculateTotals() {
        if (cartItems == null || cartItems.isEmpty()) {
            this.totalAmount = BigDecimal.ZERO;
            this.discountAmount = BigDecimal.ZERO;
            this.taxAmount = BigDecimal.ZERO;
            this.finalAmount = BigDecimal.ZERO;
            return;
        }

        this.totalAmount = cartItems.stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Set default values if null
        if (this.discountAmount == null) {
            this.discountAmount = BigDecimal.ZERO;
        }
        if (this.taxAmount == null) {
            this.taxAmount = BigDecimal.ZERO;
        }

        this.finalAmount = this.totalAmount.subtract(this.discountAmount).add(this.taxAmount);
    }

    public int getTotalItemsCount() {
        if (cartItems == null) return 0;
        return cartItems.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }
}