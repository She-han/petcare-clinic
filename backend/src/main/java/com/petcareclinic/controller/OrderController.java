package com.petcareclinic.controller;

import com.petcareclinic.model.Order;
import com.petcareclinic.model.OrderStatus;
import com.petcareclinic.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Create new order
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderData) {
        try {
            Order order = orderService.createOrder(orderData);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Get all orders (admin)
    @GetMapping
    public ResponseEntity<Page<Order>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Order> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    // Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        if (order.isPresent()) {
            return ResponseEntity.ok(order.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Order not found"));
    }

    // Get order by order number
    @GetMapping("/order-number/{orderNumber}")
    public ResponseEntity<?> getOrderByOrderNumber(@PathVariable String orderNumber) {
        Optional<Order> order = orderService.getOrderByOrderNumber(orderNumber);
        if (order.isPresent()) {
            return ResponseEntity.ok(order.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Order not found"));
    }

    // Get orders by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Order>> getOrdersByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());
        Page<Order> orders = orderService.getOrdersByUserId(userId, pageable);
        return ResponseEntity.ok(orders);
    }

    // Get orders by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    // Update order status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> statusData) {
        try {
            OrderStatus newStatus = OrderStatus.valueOf(statusData.get("status"));
            Order updatedOrder = orderService.updateOrderStatus(id, newStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Cancel order
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long id, 
            @RequestBody Map<String, String> cancelData) {
        try {
            String reason = cancelData.getOrDefault("reason", "Cancelled by customer");
            Order cancelledOrder = orderService.cancelOrder(id, reason);
            return ResponseEntity.ok(cancelledOrder);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Add tracking information
    @PatchMapping("/{id}/tracking")
    public ResponseEntity<?> addTrackingInfo(
            @PathVariable Long id,
            @RequestBody Map<String, String> trackingData) {
        try {
            String trackingNumber = trackingData.get("trackingNumber");
            String carrierName = trackingData.get("carrierName");
            Order updatedOrder = orderService.addTrackingInfo(id, trackingNumber, carrierName);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Search orders
    @GetMapping("/search")
    public ResponseEntity<Page<Order>> searchOrders(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Pageable pageable = PageRequest.of(
                page, 
                size, 
                sortDir.equalsIgnoreCase("desc") ? 
                    Sort.by(sortBy).descending() : 
                    Sort.by(sortBy).ascending()
            );
            
            Page<Order> orders = orderService.searchOrdersByQuery(query, pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("Error searching orders: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get recent orders
    @GetMapping("/recent")
    public ResponseEntity<List<Order>> getRecentOrders() {
        List<Order> orders = orderService.getRecentOrders();
        return ResponseEntity.ok(orders);
    }

    // Get orders to be shipped
    @GetMapping("/to-ship")
    public ResponseEntity<List<Order>> getOrdersToBeShipped() {
        List<Order> orders = orderService.getOrdersToBeShipped();
        return ResponseEntity.ok(orders);
    }

    // Get order count by status
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> getOrderCountByStatus(@PathVariable OrderStatus status) {
        long count = orderService.getOrderCountByStatus(status);
        return ResponseEntity.ok(count);
    }

    // Delete order (admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok(Map.of("message", "Order deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}