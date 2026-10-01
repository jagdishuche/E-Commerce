package com.ecommerce.service;

import com.ecommerce.dto.CartDto;
import com.ecommerce.dto.CartItemRequest;

public interface CartService {
    CartDto getCart(String userEmail);
    CartDto addItemToCart(String userEmail, CartItemRequest request);
    CartDto updateCartItemQuantity(String userEmail, Long cartItemId, Integer quantity);
    CartDto removeItemFromCart(String userEmail, Long cartItemId);
    void clearCart(String userEmail);
}
