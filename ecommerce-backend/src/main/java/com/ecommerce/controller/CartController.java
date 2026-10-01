package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.CartDto;
import com.ecommerce.dto.CartItemRequest;
import com.ecommerce.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(Authentication authentication) {
        CartDto cart = cartService.getCart(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDto>> addItemToCart(
            Authentication authentication,
            @Valid @RequestBody CartItemRequest request
    ) {
        CartDto cart = cartService.addItemToCart(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cart));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItemQuantity(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request
    ) {
        Integer quantity = request.get("quantity");
        CartDto cart = cartService.updateCartItemQuantity(authentication.getName(), id, quantity);
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cart));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<ApiResponse<CartDto>> removeItemFromCart(
            Authentication authentication,
            @PathVariable Long id
    ) {
        CartDto cart = cartService.removeItemFromCart(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }
}
