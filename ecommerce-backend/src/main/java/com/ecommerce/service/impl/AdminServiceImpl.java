package com.ecommerce.service.impl;

import com.ecommerce.dto.AdminStatsDto;
import com.ecommerce.dto.OrderDto;
import com.ecommerce.dto.OrderItemDto;
import com.ecommerce.dto.ProductDto;
import com.ecommerce.dto.UserDto;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.AdminService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public AdminServiceImpl(UserRepository userRepository,
                            ProductRepository productRepository,
                            OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminStatsDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        Double totalRevenue = orderRepository.calculateTotalRevenue();
        long lowStockCount = productRepository.countByStockLessThan(10);
        long pendingOrdersCount = orderRepository.countByStatus("PROCESSING");

        List<Order> recentOrdersList = orderRepository.findTop5ByOrderByCreatedAtDesc();
        List<OrderDto> recentOrders = recentOrdersList.stream().map(order -> OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .userName(order.getUser() != null ? order.getUser().getName() : "Customer")
                .userEmail(order.getUser() != null ? order.getUser().getEmail() : "")
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt())
                .orderItems(order.getOrderItems() != null ? order.getOrderItems().stream().map(item -> OrderItemDto.builder()
                        .id(item.getId())
                        .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                        .name(item.getProduct() != null ? item.getProduct().getName() : "")
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getPrice() * item.getQuantity())
                        .build()).collect(Collectors.toList()) : List.of())
                .build()).collect(Collectors.toList());

        List<Product> allProducts = productRepository.findAll();
        List<ProductDto> lowStockProducts = allProducts.stream()
                .filter(p -> p.getStock() < 10)
                .map(p -> ProductDto.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .categoryName(p.getCategory() != null ? p.getCategory().getName() : "")
                        .brand(p.getBrand())
                        .price(p.getPrice())
                        .stock(p.getStock())
                        .build())
                .limit(5)
                .collect(Collectors.toList());

        Map<String, Long> categoryDistribution = new HashMap<>();
        List<Object[]> catCounts = productRepository.countProductsByCategory();
        for (Object[] row : catCounts) {
            if (row[0] != null) {
                categoryDistribution.put((String) row[0], (Long) row[1]);
            }
        }

        return AdminStatsDto.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue != null ? Math.round(totalRevenue * 100.0) / 100.0 : 0.0)
                .lowStockProductsCount(lowStockCount)
                .pendingOrdersCount(pendingOrdersCount)
                .recentOrders(recentOrders)
                .lowStockProducts(lowStockProducts)
                .categoryProductDistribution(categoryDistribution)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .createdAt(user.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        try {
            Role role = Role.valueOf(roleName.toUpperCase());
            user.setRole(role);
            User saved = userRepository.save(user);
            return UserDto.builder()
                    .id(saved.getId())
                    .name(saved.getName())
                    .email(saved.getEmail())
                    .role(saved.getRole())
                    .createdAt(saved.getCreatedAt())
                    .build();
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role: " + roleName + ". Allowed roles: USER, ADMIN");
        }
    }
}
