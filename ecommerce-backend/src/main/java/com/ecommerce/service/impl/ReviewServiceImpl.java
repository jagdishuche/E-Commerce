package com.ecommerce.service.impl;

import com.ecommerce.dto.ReviewDto;
import com.ecommerce.dto.ReviewRequest;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.ProductReview;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ProductReviewRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.ReviewService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewServiceImpl(ProductReviewRepository reviewRepository,
                             ProductRepository productRepository,
                             UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<ReviewDto> getProductReviews(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }

        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReviewDto addReview(String userEmail, Long productId, ReviewRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (reviewRepository.existsByProductIdAndUserId(productId, user.getId())) {
            throw new BadRequestException("You have already reviewed this product");
        }

        ProductReview review = ProductReview.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment().trim())
                .createdAt(LocalDateTime.now())
                .build();

        ProductReview savedReview = reviewRepository.save(review);

        Double avgRating = reviewRepository.calculateAverageRating(productId);
        if (avgRating != null) {
            product.setRating(Math.round(avgRating * 10.0) / 10.0);
            productRepository.save(product);
        }

        return mapToDto(savedReview);
    }

    private ReviewDto mapToDto(ProductReview review) {
        return ReviewDto.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .productId(review.getProduct().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
