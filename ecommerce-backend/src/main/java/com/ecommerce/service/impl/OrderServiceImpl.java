package com.ecommerce.service.impl;

import com.ecommerce.dto.OrderDto;
import com.ecommerce.dto.OrderItemDto;
import com.ecommerce.dto.OrderRequest;
import com.ecommerce.dto.OrderStatusUpdateRequest;
import com.ecommerce.entity.*;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.*;
import com.ecommerce.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            OrderItemRepository orderItemRepository,
                            CartRepository cartRepository,
                            CartItemRepository cartItemRepository,
                            UserRepository userRepository,
                            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public OrderDto createOrder(String userEmail, OrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("No cart found for user"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cannot place order with an empty cart");
        }

        // Validate stock for all items
        double totalAmount = 0.0;
        for (CartItem item : cartItems) {
            Product p = item.getProduct();
            if (p.getStock() < item.getQuantity()) {
                throw new BadRequestException("Product '" + p.getName() + "' is out of stock or has insufficient quantity");
            }
            totalAmount += item.getPrice() * item.getQuantity();
        }

        Order order = Order.builder()
                .user(user)
                .totalAmount(Math.round(totalAmount * 100.0) / 100.0)
                .status("PROCESSING")
                .shippingAddress(request.getShippingAddress().trim())
                .paymentStatus("PAID")
                .createdAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : cartItems) {
            Product p = item.getProduct();
            p.setStock(p.getStock() - item.getQuantity());
            productRepository.save(p);

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(p)
                    .quantity(item.getQuantity())
                    .price(item.getPrice())
                    .build();
            orderItems.add(orderItem);
        }

        orderItemRepository.saveAll(orderItems);
        savedOrder.setOrderItems(orderItems);

        // Clear user's cart
        cartItemRepository.deleteByCartId(cart.getId());

        return mapToOrderDto(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToOrderDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDto getOrderById(String userEmail, Long orderId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new BadRequestException("You are not authorized to view this order");
        }

        return mapToOrderDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToOrderDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            order.setStatus(request.getStatus().trim().toUpperCase());
        }

        if (request.getPaymentStatus() != null && !request.getPaymentStatus().isBlank()) {
            order.setPaymentStatus(request.getPaymentStatus().trim().toUpperCase());
        }

        Order updatedOrder = orderRepository.save(order);
        return mapToOrderDto(updatedOrder);
    }

    private OrderDto mapToOrderDto(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

        List<OrderItemDto> itemDtos = items.stream().map(item -> {
            Product p = item.getProduct();
            double subtotal = item.getPrice() * item.getQuantity();
            return OrderItemDto.builder()
                    .id(item.getId())
                    .productId(p.getId())
                    .name(p.getName())
                    .productBrand(p.getBrand())
                    .productImageUrl(p.getImageUrl())
                    .price(item.getPrice())
                    .quantity(item.getQuantity())
                    .subtotal(Math.round(subtotal * 100.0) / 100.0)
                    .build();
        }).collect(Collectors.toList());

        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userName(order.getUser().getName())
                .userEmail(order.getUser().getEmail())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt())
                .orderItems(itemDtos)
                .build();
    }
}
