package com.ecommerce.dto;

public class WishlistDto {
    private Long id;
    private Long productId;
    private String productName;
    private String productDescription;
    private Double price;
    private String brand;
    private String imageUrl;
    private Integer stock;
    private Double rating;

    public WishlistDto() {}

    public WishlistDto(Long id, Long productId, String productName, String productDescription,
                       Double price, String brand, String imageUrl, Integer stock, Double rating) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productDescription = productDescription;
        this.price = price;
        this.brand = brand;
        this.imageUrl = imageUrl;
        this.stock = stock;
        this.rating = rating;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductDescription() { return productDescription; }
    public void setProductDescription(String productDescription) { this.productDescription = productDescription; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long productId;
        private String productName;
        private String productDescription;
        private Double price;
        private String brand;
        private String imageUrl;
        private Integer stock;
        private Double rating;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder productId(Long productId) { this.productId = productId; return this; }
        public Builder productName(String productName) { this.productName = productName; return this; }
        public Builder productDescription(String productDescription) { this.productDescription = productDescription; return this; }
        public Builder price(Double price) { this.price = price; return this; }
        public Builder brand(String brand) { this.brand = brand; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder stock(Integer stock) { this.stock = stock; return this; }
        public Builder rating(Double rating) { this.rating = rating; return this; }

        public WishlistDto build() {
            return new WishlistDto(id, productId, productName, productDescription, price, brand, imageUrl, stock, rating);
        }
    }
}
