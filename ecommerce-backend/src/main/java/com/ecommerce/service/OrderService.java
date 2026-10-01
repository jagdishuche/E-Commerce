package com.ecommerce.service;

import com.ecommerce.dto.OrderDto;
import com.ecommerce.dto.OrderRequest;
import com.ecommerce.dto.OrderStatusUpdateRequest;

import java.util.List;

public interface OrderService {
    OrderDto createOrder(String userEmail, OrderRequest request);
    List<OrderDto> getUserOrders(String userEmail);
    OrderDto getOrderById(String userEmail, Long orderId);
    List<OrderDto> getAllOrders();
    OrderDto updateOrderStatus(Long orderId, OrderStatusUpdateRequest request);
}
