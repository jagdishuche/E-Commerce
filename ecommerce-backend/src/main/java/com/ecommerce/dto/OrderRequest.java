package com.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;

public class OrderRequest {

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    private String paymentMethod;

    public OrderRequest() {}

    public OrderRequest(String shippingAddress, String paymentMethod) {
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
    }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String shippingAddress;
        private String paymentMethod;

        public Builder shippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; return this; }
        public Builder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }

        public OrderRequest build() {
            return new OrderRequest(shippingAddress, paymentMethod);
        }
    }
}
