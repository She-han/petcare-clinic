package com.petcareclinic.repository;

import com.petcareclinic.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

    List<CartItem> findByCartId(Long cartId);

    @Query("SELECT ci FROM CartItem ci JOIN FETCH ci.product WHERE ci.cart.id = :cartId")
    List<CartItem> findByCartIdWithProduct(@Param("cartId") Long cartId);

    @Query("SELECT ci FROM CartItem ci WHERE ci.id = :itemId AND ci.cart.user.id = :userId")
    Optional<CartItem> findByIdAndUserId(@Param("itemId") Long itemId, @Param("userId") Long userId);

    void deleteByCartIdAndProductId(Long cartId, Long productId);
}