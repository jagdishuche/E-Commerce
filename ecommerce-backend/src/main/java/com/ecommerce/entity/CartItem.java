package com.ecommerce.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double price;

    public CartItem() {}

    public CartItem(Long id, Cart cart, Product product, Integer quantity, Double price) {
        this.id = id;
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Cart getCart() { return cart; }
    public void setCart(Cart cart) { this.cart = cart; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Cart cart;
        private Product product;
        private Integer quantity;
        private Double price;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder cart(Cart cart) { this.cart = cart; return this; }
        public Builder product(Product product) { this.product = product; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public Builder price(Double price) { this.price = price; return this; }

        public CartItem build() {
            return new CartItem(id, cart, product, quantity, price);
        }
    }
}
