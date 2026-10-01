package com.ecommerce.dto;

public class OrderItemDto {
    private Long id;
    private Long productId;
    private String productName;
    private String productBrand;
    private String productImageUrl;
    private Double price;
    private Integer quantity;
    private Double subtotal;

    public OrderItemDto() {}

    public OrderItemDto(Long id, Long productId, String productName, String productBrand,
                        String productImageUrl, Double price, Integer quantity, Double subtotal) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productBrand = productBrand;
        this.productImageUrl = productImageUrl;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = subtotal;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductBrand() { return productBrand; }
    public void setProductBrand(String productBrand) { this.productBrand = productBrand; }

    public String getProductImageUrl() { return productImageUrl; }
    public void setProductImageUrl(String productImageUrl) { this.productImageUrl = productImageUrl; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long productId;
        private String productName;
        private String productBrand;
        private String productImageUrl;
        private Double price;
        private Integer quantity;
        private Double subtotal;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder productId(Long productId) { this.productId = productId; return this; }
        public Builder productName(String productName) { this.name(productName); return this; }
        public Builder name(String name) { this.productName = name; return this; }
        public Builder productBrand(String productBrand) { this.productBrand = productBrand; return this; }
        public Builder productImageUrl(String productImageUrl) { this.productImageUrl = productImageUrl; return this; }
        public Builder price(Double price) { this.price = price; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public Builder subtotal(Double subtotal) { this.subtotal = subtotal; return this; }

        public OrderItemDto build() {
            return new OrderItemDto(id, productId, productName, productBrand, productImageUrl, price, quantity, subtotal);
        }
    }
}
