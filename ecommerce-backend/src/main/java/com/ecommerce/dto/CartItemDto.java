package com.ecommerce.dto;

public class CartItemDto {
    private Long id;
    private Long productId;
    private String productName;
    private String productBrand;
    private String productImageUrl;
    private Double unitPrice;
    private Integer quantity;
    private Double subtotal;
    private Integer stock;

    public CartItemDto() {}

    public CartItemDto(Long id, Long productId, String productName, String productBrand, String productImageUrl,
                       Double unitPrice, Integer quantity, Double subtotal, Integer stock) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productBrand = productBrand;
        this.productImageUrl = productImageUrl;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.subtotal = subtotal;
        this.stock = stock;
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

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long productId;
        private String productName;
        private String productBrand;
        private String productImageUrl;
        private Double unitPrice;
        private Integer quantity;
        private Double subtotal;
        private Integer stock;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder productId(Long productId) { this.productId = productId; return this; }
        public Builder productName(String productName) { this.productName = productName; return this; }
        public Builder productBrand(String productBrand) { this.productBrand = productBrand; return this; }
        public Builder productImageUrl(String productImageUrl) { this.productImageUrl = productImageUrl; return this; }
        public Builder unitPrice(Double unitPrice) { this.unitPrice = unitPrice; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public Builder subtotal(Double subtotal) { this.subtotal = subtotal; return this; }
        public Builder stock(Integer stock) { this.stock = stock; return this; }

        public CartItemDto build() {
            return new CartItemDto(id, productId, productName, productBrand, productImageUrl, unitPrice, quantity, subtotal, stock);
        }
    }
}
