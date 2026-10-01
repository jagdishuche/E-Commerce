package com.ecommerce.dto;

import java.time.LocalDateTime;

public class ReviewDto {
    private Long id;
    private Long userId;
    private String userName;
    private Long productId;
    private Double rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewDto() {}

    public ReviewDto(Long id, Long userId, String userName, Long productId, Double rating, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.productId = productId;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long userId;
        private String userName;
        private Long productId;
        private Double rating;
        private String comment;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder userName(String userName) { this.userName = userName; return this; }
        public Builder productId(Long productId) { this.productId = productId; return this; }
        public Builder rating(Double rating) { this.rating = rating; return this; }
        public Builder comment(String comment) { this.comment = comment; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ReviewDto build() {
            return new ReviewDto(id, userId, userName, productId, rating, comment, createdAt);
        }
    }
}
