package com.petcareclinic.controller;

import com.petcareclinic.dto.cart.*;
import com.petcareclinic.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    @PostMapping("/add/{userId}")
    public ResponseEntity<CartDTO> addToCart(
            @PathVariable Long userId,
            @Valid @RequestBody AddToCartRequest request) {

        try {
            log.info("=== ADD TO CART DEBUG ===");
            log.info("User ID: {}", userId);
            log.info("Request: {}", request);

            if (request != null) {
                log.info("Product ID: {}", request.getProductId());
                log.info("Quantity: {}", request.getQuantity());
                log.info("Unit Price: {}", request.getUnitPrice());
            }

            log.info("Calling cartService.addToCart...");
            CartDTO cart = cartService.addToCart(userId, request);

            log.info("Successfully added to cart");
            return ResponseEntity.ok(cart);

        } catch (Exception e) {
            log.error("ERROR in addToCart controller:");
            log.error("Error message: {}", e.getMessage());
            log.error("Error class: {}", e.getClass().getSimpleName());
            log.error("Full stack trace:", e);

            // Return a more specific error response
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CartDTO> getCart(@PathVariable Long userId) {
        try {
            log.info("Fetching cart for user: {}", userId);
            CartDTO cart = cartService.getActiveCart(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            log.error("Error in getCart: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{userId}/items/{itemId}")
    public ResponseEntity<CartDTO> updateCartItem(
            @PathVariable Long userId,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {

        try {
            log.info("Updating cart item {} for user: {}", itemId, userId);
            CartDTO cart = cartService.updateCartItem(userId, itemId, request);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            log.error("Error in updateCartItem: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/{userId}/items/{itemId}")
    public ResponseEntity<CartDTO> removeCartItem(
            @PathVariable Long userId,
            @PathVariable Long itemId) {

        try {
            log.info("Removing cart item {} for user: {}", itemId, userId);
            CartDTO cart = cartService.removeCartItem(userId, itemId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            log.error("Error in removeCartItem: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        try {
            log.info("Clearing cart for user: {}", userId);
            cartService.clearCart(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error in clearCart: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{userId}/count")
    public ResponseEntity<Integer> getCartItemsCount(@PathVariable Long userId) {
        try {
            int count = cartService.getCartItemsCount(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("Error in getCartItemsCount: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
}