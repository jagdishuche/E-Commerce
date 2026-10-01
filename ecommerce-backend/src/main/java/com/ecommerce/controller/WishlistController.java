package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.WishlistDto;
import com.ecommerce.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistDto>>> getWishlist(Authentication authentication) {
        List<WishlistDto> wishlist = wishlistService.getWishlist(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(wishlist));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WishlistDto>> addToWishlist(
            Authentication authentication,
            @RequestBody Map<String, Long> payload
    ) {
        Long productId = payload.get("productId");
        WishlistDto item = wishlistService.addToWishlist(authentication.getName(), productId);
        return ResponseEntity.ok(ApiResponse.success("Added to wishlist", item));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse<WishlistDto>> addToWishlistByPath(
            Authentication authentication,
            @PathVariable Long productId
    ) {
        WishlistDto item = wishlistService.addToWishlist(authentication.getName(), productId);
        return ResponseEntity.ok(ApiResponse.success("Added to wishlist", item));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(
            Authentication authentication,
            @PathVariable Long productId
    ) {
        wishlistService.removeFromWishlist(authentication.getName(), productId);
        return ResponseEntity.ok(ApiResponse.success("Removed from wishlist", null));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Boolean>> checkWishlist(
            Authentication authentication,
            @PathVariable Long productId
    ) {
        boolean inWishlist = wishlistService.isInWishlist(authentication.getName(), productId);
        return ResponseEntity.ok(ApiResponse.success(inWishlist));
    }
}
