package com.ecommerce.service;

import com.ecommerce.dto.WishlistDto;

import java.util.List;

public interface WishlistService {
    List<WishlistDto> getWishlist(String userEmail);
    WishlistDto addToWishlist(String userEmail, Long productId);
    void removeFromWishlist(String userEmail, Long productId);
    boolean isInWishlist(String userEmail, Long productId);
}
