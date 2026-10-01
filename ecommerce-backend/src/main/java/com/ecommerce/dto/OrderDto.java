package com.ecommerce.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Double totalAmount;
    private String status;
    private String shippingAddress;
    private String paymentStatus;
    private LocalDateTime createdAt;
    private List<OrderItemDto> orderItems = new ArrayList<>();

    public OrderDto() {}

    public OrderDto(Long id, Long userId, String userName, String userEmail, Double totalAmount,
                    String status, String shippingAddress, String paymentStatus,
                    LocalDateTime createdAt, List<OrderItemDto> orderItems) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.totalAmount = totalAmount;
        this.status = status;
        this.shippingAddress = shippingAddress;
        this.paymentStatus = paymentStatus;
        this.createdAt = createdAt;
        this.orderItems = orderItems != null ? orderItems : new ArrayList<>();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<OrderItemDto> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemDto> orderItems) { this.orderItems = orderItems; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long userId;
        private String userName;
        private String userEmail;
        private Double totalAmount;
        private String status;
        private String shippingAddress;
        private String paymentStatus;
        private LocalDateTime createdAt;
        private List<OrderItemDto> orderItems = new ArrayList<>();

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder userName(String userName) { this.userName = userName; return this; }
        public Builder userEmail(String userEmail) { this.userEmail = userEmail; return this; }
        public Builder totalAmount(Double totalAmount) { this.totalAmount = totalAmount; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder shippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; return this; }
        public Builder paymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder orderItems(List<OrderItemDto> orderItems) { this.orderItems = orderItems; return this; }

        public OrderDto build() {
            return new OrderDto(id, userId, userName, userEmail, totalAmount, status, shippingAddress, paymentStatus, createdAt, orderItems);
        }
    }
}
