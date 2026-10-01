package com.ecommerce.service.impl;

import com.ecommerce.dto.CartDto;
import com.ecommerce.dto.CartItemDto;
import com.ecommerce.dto.CartItemRequest;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartServiceImpl(CartRepository cartRepository,
                           CartItemRepository cartItemRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public CartDto getCart(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        return mapToCartDto(cart);
    }

    @Override
    @Transactional
    public CartDto addItemToCart(String userEmail, CartItemRequest request) {
        Cart cart = getOrCreateCart(userEmail);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + product.getStock() + ")");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (product.getStock() < newQuantity) {
                throw new BadRequestException("Requested quantity exceeds available stock (" + product.getStock() + ")");
            }
            existingItem.setQuantity(newQuantity);
            existingItem.setPrice(product.getPrice());
            cartItemRepository.save(existingItem);
        } else {
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .price(product.getPrice())
                    .build();
            cartItemRepository.save(cartItem);
        }

        return getCart(userEmail);
    }

    @Override
    @Transactional
    public CartDto updateCartItemQuantity(String userEmail, Long cartItemId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            return removeItemFromCart(userEmail, cartItemId);
        }

        Cart cart = getOrCreateCart(userEmail);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        if (cartItem.getProduct().getStock() < quantity) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + cartItem.getProduct().getStock() + ")");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        return getCart(userEmail);
    }

    @Override
    @Transactional
    public CartDto removeItemFromCart(String userEmail, Long cartItemId) {
        Cart cart = getOrCreateCart(userEmail);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        cartItemRepository.delete(cartItem);
        return getCart(userEmail);
    }

    @Override
    @Transactional
    public void clearCart(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        cartItemRepository.deleteByCartId(cart.getId());
    }

    private Cart getOrCreateCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .user(user)
                            .items(new ArrayList<>())
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    private CartDto mapToCartDto(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());

        List<CartItemDto> itemDtos = items.stream().map(item -> {
            Product p = item.getProduct();
            double subtotal = item.getPrice() * item.getQuantity();
            return CartItemDto.builder()
                    .id(item.getId())
                    .productId(p.getId())
                    .productName(p.getName())
                    .productBrand(p.getBrand())
                    .productImageUrl(p.getImageUrl())
                    .unitPrice(item.getPrice())
                    .quantity(item.getQuantity())
                    .subtotal(Math.round(subtotal * 100.0) / 100.0)
                    .stock(p.getStock())
                    .build();
        }).collect(Collectors.toList());

        int totalItems = itemDtos.stream().mapToInt(CartItemDto::getQuantity).sum();
        double totalPrice = itemDtos.stream().mapToDouble(CartItemDto::getSubtotal).sum();

        return CartDto.builder()
                .id(cart.getId())
                .items(itemDtos)
                .totalItems(totalItems)
                .totalPrice(Math.round(totalPrice * 100.0) / 100.0)
                .build();
    }
}
