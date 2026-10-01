package com.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;

public class OrderStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private String paymentStatus;

    public OrderStatusUpdateRequest() {}

    public OrderStatusUpdateRequest(String status, String paymentStatus) {
        this.status = status;
        this.paymentStatus = paymentStatus;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String status;
        private String paymentStatus;

        public Builder status(String status) { this.status = status; return this; }
        public Builder paymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; return this; }

        public OrderStatusUpdateRequest build() {
            return new OrderStatusUpdateRequest(status, paymentStatus);
        }
    }
}
