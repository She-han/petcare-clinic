package com.petcareclinic.service;

import com.petcareclinic.dto.cart.*;
import com.petcareclinic.model.*;
import com.petcareclinic.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartDTO addToCart(Long userId, AddToCartRequest request) {
        log.info("Adding product {} to cart for user {}", request.getProductId(), userId);

        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Validate product exists and has sufficient stock
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        // Get or create active cart
        Cart cart = getOrCreateActiveCart(user);

        // Check if product already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), request.getProductId());

        if (existingItem.isPresent()) {
            // Update existing item
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();

            if (product.getStockQuantity() < newQuantity) {
                throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity());
            }

            item.setQuantity(newQuantity);
            // Use product's current price for security
            item.setUnitPrice(BigDecimal.valueOf(product.getPrice()));
            item.calculateTotalPrice();
            cartItemRepository.save(item);
        } else {
            // Create new cart item - Use product's current price, not request price
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .unitPrice(BigDecimal.valueOf(product.getPrice())) // Use product price
                    .build();

            newItem.calculateTotalPrice();
            cartItemRepository.save(newItem);
            cart.getCartItems().add(newItem);
        }

        // Recalculate cart totals
        cart.calculateTotals();
        cartRepository.save(cart);

        log.info("Successfully added product to cart. Cart ID: {}", cart.getId());
        return convertToDTO(cart);
    }

    @Transactional(readOnly = true)
    public CartDTO getActiveCart(Long userId) {
        log.info("Fetching active cart for user {}", userId);

        Optional<Cart> cart = cartRepository.findActiveCartByUserId(userId);
        if (cart.isEmpty()) {
            // Return empty cart DTO
            return CartDTO.builder()
                    .userId(userId)
                    .status(CartStatus.ACTIVE)
                    .totalAmount(BigDecimal.ZERO)
                    .discountAmount(BigDecimal.ZERO)
                    .taxAmount(BigDecimal.ZERO)
                    .finalAmount(BigDecimal.ZERO)
                    .totalItemsCount(0)
                    .cartItems(java.util.Collections.emptyList())
                    .build();
        }

        return convertToDTO(cart.get());
    }

    public CartDTO updateCartItem(Long userId, Long itemId, UpdateCartItemRequest request) {
        log.info("Updating cart item {} for user {}", itemId, userId);

        CartItem item = cartItemRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Check stock availability
        if (item.getProduct().getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + item.getProduct().getStockQuantity());
        }

        item.setQuantity(request.getQuantity());
        // Update unit price to current product price for security
        item.setUnitPrice(BigDecimal.valueOf(item.getProduct().getPrice()));
        item.calculateTotalPrice();
        cartItemRepository.save(item);

        // Recalculate cart totals
        Cart cart = item.getCart();
        cart.calculateTotals();
        cartRepository.save(cart);

        log.info("Successfully updated cart item {}", itemId);
        return convertToDTO(cart);
    }

    public CartDTO removeCartItem(Long userId, Long itemId) {
        log.info("Removing cart item {} for user {}", itemId, userId);

        CartItem item = cartItemRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        Cart cart = item.getCart();
        cart.getCartItems().remove(item);
        cartItemRepository.delete(item);

        // Recalculate cart totals
        cart.calculateTotals();
        cartRepository.save(cart);

        log.info("Successfully removed cart item {}", itemId);
        return convertToDTO(cart);
    }

    public void clearCart(Long userId) {
        log.info("Clearing cart for user {}", userId);

        Optional<Cart> cart = cartRepository.findActiveCartByUserId(userId);
        if (cart.isPresent()) {
            cartItemRepository.deleteAll(cart.get().getCartItems());
            cart.get().getCartItems().clear();
            cart.get().calculateTotals();
            cartRepository.save(cart.get());
        }

        log.info("Successfully cleared cart for user {}", userId);
    }

    @Transactional(readOnly = true)
    public int getCartItemsCount(Long userId) {
        try {
            log.info("Getting cart items count for user: {}", userId);

            // Use the optimized repository method
            int totalCount = cartRepository.countActiveCartItemsByUserId(userId);

            log.info("Cart items count for user {}: {}", userId, totalCount);
            return totalCount;

        } catch (Exception e) {
            log.error("Error getting cart items count for user {}: {}", userId, e.getMessage(), e);
            return 0;
        }
    }

    private Cart getOrCreateActiveCart(User user) {
        Optional<Cart> existingCart = cartRepository.findActiveCartByUserId(user.getId());

        if (existingCart.isPresent()) {
            return existingCart.get();
        }

        // Create new cart - Use CartStatus enum directly
        Cart newCart = Cart.builder()
                .user(user)
                .status(CartStatus.ACTIVE)
                .totalAmount(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .taxAmount(BigDecimal.ZERO)
                .finalAmount(BigDecimal.ZERO)
                .cartItems(new ArrayList<>())
                .build();

        return cartRepository.save(newCart);
    }

    private CartDTO convertToDTO(Cart cart) {
        CartStatus status = cart.getStatus() != null ? cart.getStatus() : CartStatus.ACTIVE;

        return CartDTO.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .userName(cart.getUser().getFirstName() + " " + cart.getUser().getLastName())
                .status(status)
                .totalAmount(cart.getTotalAmount() != null ? cart.getTotalAmount() : BigDecimal.ZERO)
                .discountAmount(cart.getDiscountAmount() != null ? cart.getDiscountAmount() : BigDecimal.ZERO)
                .taxAmount(cart.getTaxAmount() != null ? cart.getTaxAmount() : BigDecimal.ZERO)
                .finalAmount(cart.getFinalAmount() != null ? cart.getFinalAmount() : BigDecimal.ZERO)
                .couponCode(cart.getCouponCode())
                .totalItemsCount(cart.getTotalItemsCount())
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .cartItems(cart.getCartItems() != null ?
                        cart.getCartItems().stream()
                                .map(this::convertItemToDTO)
                                .collect(Collectors.toList()) :
                        java.util.Collections.emptyList())
                .build();
    }

    private CartItemDTO convertItemToDTO(CartItem item) {
        return CartItemDTO.builder()
                .id(item.getId())
                .cartId(item.getCart().getId())
                .product(convertProductToSummary(item.getProduct()))
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }

    private com.petcareclinic.dto.product.ProductSummaryDTO convertProductToSummary(Product product) {
        return com.petcareclinic.dto.product.ProductSummaryDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .price(BigDecimal.valueOf(product.getPrice()))
                .imageUrl(product.getImageUrl())
                .category(ProductCategory.valueOf(product.getCategory()))
                .stockQuantity(product.getStockQuantity())
                .brand(product.getBrand())
                .rating(product.getRating())
                .build();
    }
}