package com.petcareclinic.repository;

import com.petcareclinic.model.Cart;
import com.petcareclinic.model.CartStatus;
import com.petcareclinic.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // Main method for finding active cart with items and products
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.cartItems ci LEFT JOIN FETCH ci.product " +
            "WHERE c.user.id = :userId AND c.status = 'ACTIVE'")
    Optional<Cart> findActiveCartByUserId(@Param("userId") Long userId);

    // Find cart by user ID and status (String)
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.cartItems ci LEFT JOIN FETCH ci.product " +
            "WHERE c.user.id = :userId AND c.status = :status")
    Optional<Cart> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);

    // Find cart by user ID and status (Enum) - if needed
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.cartItems ci LEFT JOIN FETCH ci.product " +
            "WHERE c.user.id = :userId AND c.status = :status")
    Optional<Cart> findByUserIdAndStatusEnum(@Param("userId") Long userId, @Param("status") CartStatus status);

    // Find cart by User object and status
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.cartItems ci LEFT JOIN FETCH ci.product " +
            "WHERE c.user = :user AND c.status = :status")
    Optional<Cart> findByUserAndStatus(@Param("user") User user, @Param("status") String status);

    // Find cart by cart ID and user ID (for security)
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.cartItems ci LEFT JOIN FETCH ci.product " +
            "WHERE c.id = :cartId AND c.user.id = :userId")
    Optional<Cart> findByIdAndUserId(@Param("cartId") Long cartId, @Param("userId") Long userId);

    // Get all carts for a user ordered by creation date
    @Query("SELECT c FROM Cart c WHERE c.user.id = :userId ORDER BY c.createdAt DESC")
    List<Cart> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    // Count total cart items for active cart
    @Query("SELECT COALESCE(SUM(ci.quantity), 0) FROM CartItem ci WHERE ci.cart.user.id = :userId AND ci.cart.status = 'ACTIVE'")
    int countActiveCartItemsByUserId(@Param("userId") Long userId);

    // Count number of different products in active cart
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.cart.user.id = :userId AND ci.cart.status = 'ACTIVE'")
    int countActiveCartProductsByUserId(@Param("userId") Long userId);
}