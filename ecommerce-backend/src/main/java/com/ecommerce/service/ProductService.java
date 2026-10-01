package com.ecommerce.service;

import com.ecommerce.dto.PageResponse;
import com.ecommerce.dto.ProductDto;
import com.ecommerce.dto.ProductRequest;

import java.util.List;

public interface ProductService {
    PageResponse<ProductDto> getProducts(String search, Long categoryId, String brand,
                                         Double minPrice, Double maxPrice, Double minRating,
                                         String sortBy, String sortDir, int page, int size);
    ProductDto getProductById(Long id);
    List<ProductDto> getFeaturedProducts();
    List<ProductDto> getTrendingProducts();
    List<String> getBrands();
    ProductDto createProduct(ProductRequest request);
    ProductDto updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
}
