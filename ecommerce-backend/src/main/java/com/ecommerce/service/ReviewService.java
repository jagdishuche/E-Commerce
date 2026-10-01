package com.ecommerce.service;

import com.ecommerce.dto.ReviewDto;
import com.ecommerce.dto.ReviewRequest;

import java.util.List;

public interface ReviewService {
    List<ReviewDto> getProductReviews(Long productId);
    ReviewDto addReview(String userEmail, Long productId, ReviewRequest request);
}
