package com.ecommerce.dto;

import java.util.ArrayList;
import java.util.List;

public class CartDto {
    private Long id;
    private List<CartItemDto> items = new ArrayList<>();
    private Integer totalItems;
    private Double totalPrice;

    public CartDto() {}

    public CartDto(Long id, List<CartItemDto> items, Integer totalItems, Double totalPrice) {
        this.id = id;
        this.items = items != null ? items : new ArrayList<>();
        this.totalItems = totalItems;
        this.totalPrice = totalPrice;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<CartItemDto> getItems() { return items; }
    public void setItems(List<CartItemDto> items) { this.items = items; }

    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private List<CartItemDto> items = new ArrayList<>();
        private Integer totalItems;
        private Double totalPrice;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder items(List<CartItemDto> items) { this.items = items; return this; }
        public Builder totalItems(Integer totalItems) { this.totalItems = totalItems; return this; }
        public Builder totalPrice(Double totalPrice) { this.totalPrice = totalPrice; return this; }

        public CartDto build() {
            return new CartDto(id, items, totalItems, totalPrice);
        }
    }
}
