
package com.petcareclinic.repository;

import com.petcareclinic.model.Order;
import com.petcareclinic.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Find orders by user
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
    
    // Find orders by user with pagination
    Page<Order> findByUserIdOrderByOrderDateDesc(Long userId, Pageable pageable);
    
    // Find orders by status
    List<Order> findByStatusOrderByOrderDateDesc(OrderStatus status);
    
    // Find order by order number
    Optional<Order> findByOrderNumber(String orderNumber);
    
    // Find orders by user and status
    List<Order> findByUserIdAndStatusOrderByOrderDateDesc(Long userId, OrderStatus status);
    
    // Find orders between dates
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate ORDER BY o.orderDate DESC")
    List<Order> findOrdersBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                      @Param("endDate") LocalDateTime endDate);
    
    // Find recent orders (last 30 days)
    @Query("SELECT o FROM Order o WHERE o.orderDate >= :sinceDate ORDER BY o.orderDate DESC")
    List<Order> findRecentOrders(@Param("sinceDate") LocalDateTime sinceDate);
    
    // Count orders by status
    long countByStatus(OrderStatus status);
    
    // Count orders by user
    long countByUserId(Long userId);
    
    // Find orders that need to be shipped
    @Query("SELECT o FROM Order o WHERE o.status IN ('CONFIRMED', 'PROCESSING', 'TO_BE_SENT') ORDER BY o.orderDate ASC")
    List<Order> findOrdersToBeShipped();
    
    // Search orders by multiple criteria
    @Query("SELECT o FROM Order o WHERE " +
           "(:userId IS NULL OR o.userId = :userId) AND " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:orderNumber IS NULL OR LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :orderNumber, '%'))) AND " +
           "(:customerName IS NULL OR LOWER(o.shippingFullName) LIKE LOWER(CONCAT('%', :customerName, '%'))) " +
           "ORDER BY o.orderDate DESC")
    Page<Order> searchOrders(@Param("userId") Long userId,
                            @Param("status") OrderStatus status,
                            @Param("orderNumber") String orderNumber,
                            @Param("customerName") String customerName,
                            Pageable pageable);

    // Search orders by general query
    @Query("SELECT o FROM Order o LEFT JOIN o.user u WHERE " +
           "LOWER(o.orderNumber) LIKE :searchTerm OR " +
           "LOWER(o.shippingFullName) LIKE :searchTerm OR " +
           "LOWER(o.shippingEmail) LIKE :searchTerm OR " +
           "LOWER(u.firstName) LIKE :searchTerm OR " +
           "LOWER(u.lastName) LIKE :searchTerm OR " +
           "LOWER(u.email) LIKE :searchTerm " +
           "ORDER BY o.orderDate DESC")
    Page<Order> searchOrdersByQuery(@Param("searchTerm") String searchTerm, Pageable pageable);
}