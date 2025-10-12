package com.petcareclinic.service;

import com.petcareclinic.model.Order;
import com.petcareclinic.model.OrderItem;
import com.petcareclinic.model.OrderStatus;
import com.petcareclinic.model.Product;
import com.petcareclinic.model.CartItem;
import com.petcareclinic.repository.OrderRepository;
import com.petcareclinic.repository.CartItemRepository;
import com.petcareclinic.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    // Create new order from cart items
    @Transactional
    public Order createOrder(Map<String, Object> orderData) {
        try {
            Long userId = Long.valueOf(orderData.get("userId").toString());
            List<Long> cartItemIds = (List<Long>) orderData.get("cartItemIds");
            Map<String, Object> shippingDetails = (Map<String, Object>) orderData.get("shippingDetails");
            String paymentMethod = orderData.get("paymentMethod").toString();
            BigDecimal subtotal = new BigDecimal(orderData.get("subtotal").toString());
            BigDecimal taxAmount = new BigDecimal(orderData.get("taxAmount").toString());
            BigDecimal totalAmount = new BigDecimal(orderData.get("totalAmount").toString());

            // Generate unique order number
            String orderNumber = generateOrderNumber();

            // Create new order
            Order order = new Order();
            order.setUserId(userId);
            order.setOrderNumber(orderNumber);
            order.setSubtotal(subtotal);
            order.setTaxAmount(taxAmount);
            order.setShippingCost(BigDecimal.ZERO); // Free shipping for now
            order.setTotalAmount(totalAmount);
            order.setPaymentMethod(paymentMethod);
            order.setStatus(OrderStatus.CONFIRMED);
            order.setPaymentStatus("COMPLETED");
            order.setConfirmedDate(LocalDateTime.now());

            // Set shipping details
            order.setShippingFullName(shippingDetails.get("fullName").toString());
            order.setShippingEmail(shippingDetails.get("email").toString());
            order.setShippingPhone(shippingDetails.get("phone").toString());
            order.setShippingAddress(shippingDetails.get("address").toString());
            order.setShippingCity(shippingDetails.get("city").toString());
            order.setShippingState(shippingDetails.get("state").toString());
            order.setShippingZipCode(shippingDetails.get("zipCode").toString());
            order.setShippingCountry(shippingDetails.get("country").toString());

            // Save order first to get ID
            order = orderRepository.save(order);

            // Create order items from cart items
            List<OrderItem> orderItems = new ArrayList<>();
            for (Long cartItemId : cartItemIds) {
                Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
                if (cartItemOpt.isPresent()) {
                    CartItem cartItem = cartItemOpt.get();
                    Product product = cartItem.getProduct();

                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrderId(order.getId());
                    orderItem.setProductId(product.getId());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setUnitPrice(cartItem.getUnitPrice());
                    orderItem.setTotalPrice(cartItem.getUnitPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
                    orderItem.setProductName(product.getName());
                    orderItem.setProductDescription(product.getDescription());
                    orderItem.setProductImageUrl(product.getImageUrl());

                    orderItems.add(orderItem);

                    // Update product stock
                    if (product.getStockQuantity() != null && product.getStockQuantity() >= cartItem.getQuantity()) {
                        product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
                        productRepository.save(product);
                    }
                }
            }

            order.setOrderItems(orderItems);

            // Remove cart items after creating order
            cartItemRepository.deleteAllById(cartItemIds);

            return orderRepository.save(order);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    // Generate unique order number
    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.valueOf((int) (Math.random() * 1000));
        return "ORD-" + timestamp + "-" + String.format("%03d", Integer.parseInt(random));
    }

    // Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get orders with pagination
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    // Get order by ID
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // Get order by order number
    public Optional<Order> getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }

    // Get orders by user ID
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    // Get orders by user ID with pagination
    public Page<Order> getOrdersByUserId(Long userId, Pageable pageable) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId, pageable);
    }

    // Get orders by status
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatusOrderByOrderDateDesc(status);
    }

    // Update order status
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            OrderStatus oldStatus = order.getStatus();
            order.setStatus(newStatus);

            // Set appropriate dates based on status
            LocalDateTime now = LocalDateTime.now();
            switch (newStatus) {
                case CONFIRMED:
                    if (order.getConfirmedDate() == null) {
                        order.setConfirmedDate(now);
                    }
                    break;
                case SENT:
                    if (order.getShippedDate() == null) {
                        order.setShippedDate(now);
                    }
                    break;
                case DELIVERED:
                    if (order.getDeliveredDate() == null) {
                        order.setDeliveredDate(now);
                    }
                    break;
                case CANCELLED:
                    if (order.getCancelledDate() == null) {
                        order.setCancelledDate(now);
                    }
                    break;
            }

            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found with ID: " + orderId);
    }

    // Cancel order
    @Transactional
    public Order cancelOrder(Long orderId, String reason) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            
            // Only allow cancellation for certain statuses
            if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
                throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
            }

            order.setStatus(OrderStatus.CANCELLED);
            order.setCancelledDate(LocalDateTime.now());
            order.setCancellationReason(reason);

            // Restore product stock
            for (OrderItem item : order.getOrderItems()) {
                Optional<Product> productOpt = productRepository.findById(item.getProductId());
                if (productOpt.isPresent()) {
                    Product product = productOpt.get();
                    if (product.getStockQuantity() != null) {
                        product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                        productRepository.save(product);
                    }
                }
            }

            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found with ID: " + orderId);
    }

    // Add tracking information
    @Transactional
    public Order addTrackingInfo(Long orderId, String trackingNumber, String carrierName) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setTrackingNumber(trackingNumber);
            order.setCarrierName(carrierName);
            
            // If not already shipped, update status
            if (order.getStatus() == OrderStatus.CONFIRMED || order.getStatus() == OrderStatus.PROCESSING) {
                order.setStatus(OrderStatus.SENT);
                order.setShippedDate(LocalDateTime.now());
            }

            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found with ID: " + orderId);
    }

    // Get recent orders (last 30 days)
    public List<Order> getRecentOrders() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return orderRepository.findRecentOrders(thirtyDaysAgo);
    }

    // Get orders count by status
    public long getOrderCountByStatus(OrderStatus status) {
        return orderRepository.countByStatus(status);
    }

    // Search orders with multiple criteria
    public Page<Order> searchOrders(Long userId, OrderStatus status, String orderNumber, 
                                  String customerName, Pageable pageable) {
        return orderRepository.searchOrders(userId, status, orderNumber, customerName, pageable);
    }

    // Get orders that need to be shipped
    public List<Order> getOrdersToBeShipped() {
        return orderRepository.findOrdersToBeShipped();
    }

    // Delete order (admin only)
    @Transactional
    public void deleteOrder(Long orderId) {
        if (orderRepository.existsById(orderId)) {
            orderRepository.deleteById(orderId);
        } else {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }
    }
}
