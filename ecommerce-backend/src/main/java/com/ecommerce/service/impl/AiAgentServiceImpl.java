package com.ecommerce.service.impl;

import com.ecommerce.dto.AiChatRequest;
import com.ecommerce.dto.AiChatResponse;
import com.ecommerce.dto.OrderDto;
import com.ecommerce.dto.OrderItemDto;
import com.ecommerce.dto.ProductDto;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.AiAgentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AiAgentServiceImpl implements AiAgentService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public AiAgentServiceImpl(ProductRepository productRepository,
                              OrderRepository orderRepository,
                              UserRepository userRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AiChatResponse processChat(String userEmail, AiChatRequest request) {
        String msg = request.getMessage() != null ? request.getMessage().trim().toLowerCase() : "";
        User user = null;
        if (userEmail != null && !userEmail.isBlank() && !userEmail.equals("anonymousUser")) {
            user = userRepository.findByEmail(userEmail).orElse(null);
        }

        // 1. ORDER TRACKING INTENT
        if (msg.contains("order") || msg.contains("track") || msg.contains("package") || msg.contains("delivery")) {
            return handleOrderTracking(user, msg);
        }

        // 2. DISCOUNTS, PROMOS & DEALS INTENT
        if (msg.contains("promo") || msg.contains("coupon") || msg.contains("discount") || msg.contains("deal") || msg.contains("code") || msg.contains("sale")) {
            return handleDealsAndPromos();
        }

        // 3. SHIPPING & RETURN POLICY INTENT
        if (msg.contains("return") || msg.contains("refund") || msg.contains("exchange") || msg.contains("policy") || msg.contains("shipping cost") || msg.contains("support")) {
            return handlePoliciesAndSupport(msg);
        }

        // 4. PRODUCT RECOMMENDATION & SEARCH INTENT
        if (isProductSearchIntent(msg)) {
            return handleProductSearch(msg);
        }

        // 5. GREETING / DEFAULT FALLBACK
        return handleGeneralConversation(user, msg);
    }

    @Override
    public List<String> getSuggestedPrompts(String userEmail) {
        List<String> prompts = new ArrayList<>();
        prompts.add("🔥 What are your trending products right now?");
        prompts.add("🎧 Find me noise-cancelling headphones");
        prompts.add("🏷️ Are there any active discount codes?");
        if (userEmail != null && !userEmail.isBlank() && !userEmail.equals("anonymousUser")) {
            prompts.add("📦 Track my latest order status");
        } else {
            prompts.add("⚡ What is your return & shipping policy?");
        }
        return prompts;
    }

    private AiChatResponse handleOrderTracking(User user, String msg) {
        if (user == null) {
            return AiChatResponse.builder()
                    .intent("ORDER_TRACKING_ANONYMOUS")
                    .reply("I can certainly help you track your packages! Please **sign in to your account** so I can look up your orders securely.")
                    .suggestedActions(List.of("Log In", "Create Account", "Explore Products"))
                    .build();
        }

        List<Order> userOrders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        if (userOrders.isEmpty()) {
            return AiChatResponse.builder()
                    .intent("NO_ORDERS_FOUND")
                    .reply("Hi " + user.getName() + ", I checked your account but you don't have any past orders yet. Would you like me to recommend our best-selling items?")
                    .suggestedActions(List.of("Browse Best Sellers", "View Electronics", "View Fashion"))
                    .build();
        }

        // Check if user specifically requested an order ID, e.g., "order 1" or "#2"
        Pattern pattern = Pattern.compile("(?:order|#)\\s*(\\d+)");
        Matcher matcher = pattern.matcher(msg);
        Order targetOrder = userOrders.get(0); // default to most recent order

        if (matcher.find()) {
            try {
                long orderId = Long.parseLong(matcher.group(1));
                targetOrder = userOrders.stream()
                        .filter(o -> o.getId().equals(orderId))
                        .findFirst()
                        .orElse(userOrders.get(0));
            } catch (Exception ignored) {}
        }

        String statusExplanation = switch (targetOrder.getStatus().toUpperCase()) {
            case "DELIVERED" -> "Your package has been successfully **delivered** to your address! 🎉";
            case "SHIPPED" -> "Your package is **in transit** with our express courier and on schedule for delivery! 🚚";
            case "CANCELLED" -> "This order was marked as **cancelled**. If this was unexpected, please contact support.";
            default -> "Your order is currently being **processed and packed** at our fulfillment center. 📦";
        };

        OrderDto orderDto = OrderDto.builder()
                .id(targetOrder.getId())
                .userId(user.getId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .totalAmount(targetOrder.getTotalAmount())
                .status(targetOrder.getStatus())
                .shippingAddress(targetOrder.getShippingAddress())
                .paymentStatus(targetOrder.getPaymentStatus())
                .createdAt(targetOrder.getCreatedAt())
                .orderItems(targetOrder.getOrderItems() != null ? targetOrder.getOrderItems().stream().map(it -> OrderItemDto.builder()
                        .id(it.getId())
                        .productId(it.getProduct().getId())
                        .name(it.getProduct().getName())
                        .productBrand(it.getProduct().getBrand())
                        .productImageUrl(it.getProduct().getImageUrl())
                        .price(it.getPrice())
                        .quantity(it.getQuantity())
                        .subtotal(it.getPrice() * it.getQuantity())
                        .build()).collect(Collectors.toList()) : List.of())
                .build();

        String reply = "Here are the details for **Order #" + targetOrder.getId() + "**:\n\n" +
                statusExplanation + "\n\n" +
                "• **Total**: $" + String.format("%.2f", targetOrder.getTotalAmount()) + "\n" +
                "• **Payment**: " + targetOrder.getPaymentStatus() + "\n" +
                "• **Destination**: " + targetOrder.getShippingAddress();

        return AiChatResponse.builder()
                .intent("ORDER_TRACKING_SUCCESS")
                .reply(reply)
                .order(orderDto)
                .suggestedActions(List.of("View All Orders", "Browse Shop", "Ask About Returns"))
                .build();
    }

    private AiChatResponse handleDealsAndPromos() {
        return AiChatResponse.builder()
                .intent("DEALS_AND_PROMOS")
                .reply("🎉 **Great news! Here are today's active promotions:**\n\n" +
                        "1. **20% Off Everything**: Use code `NOVA20` during checkout for an instant 20% discount on your order.\n" +
                        "2. **Free Express Delivery**: Automatic free 2-day shipping on all orders over **$75**.\n" +
                        "3. **30-Day Hassle-Free Returns**: Shop with 100% peace of mind.\n\n" +
                        "Would you like me to find popular products to add to your cart?")
                .suggestedActions(List.of("Show Best Sellers", "Show Headphones under $300", "Go to Cart"))
                .build();
    }

    private AiChatResponse handlePoliciesAndSupport(String msg) {
        if (msg.contains("return") || msg.contains("refund") || msg.contains("exchange")) {
            return AiChatResponse.builder()
                    .intent("RETURN_POLICY")
                    .reply("🛡️ **Return & Refund Policy:**\n\n" +
                            "• We offer a **30-day hassle-free return window** on all items from date of delivery.\n" +
                            "• Items must be in original condition with manufacturer packaging.\n" +
                            "• Refunds are credited directly back to your original payment method within 3 business days of return receipt.")
                    .suggestedActions(List.of("Track an Order", "Browse Products", "Contact Support"))
                    .build();
        }

        return AiChatResponse.builder()
                .intent("SHIPPING_SUPPORT")
                .reply("🚚 **Shipping & Delivery:**\n\n" +
                        "• **Free Express Shipping** on orders over **$75** (otherwise a flat $9.99 rate).\n" +
                        "• Delivery typically takes **2-3 business days** with full real-time tracking.\n" +
                        "• Have questions? Reach our 24/7 support team anytime at **support@novastore.com**.")
                .suggestedActions(List.of("Check Active Promos", "Browse Shop", "Track Order"))
                .build();
    }

    private boolean isProductSearchIntent(String msg) {
        return msg.contains("recommend") || msg.contains("find") || msg.contains("show") ||
                msg.contains("suggest") || msg.contains("search") || msg.contains("buy") ||
                msg.contains("laptop") || msg.contains("headphone") || msg.contains("audio") ||
                msg.contains("shoes") || msg.contains("watch") || msg.contains("chair") ||
                msg.contains("keyboard") || msg.contains("lamp") || msg.contains("jacket") ||
                msg.contains("coat") || msg.contains("electronics") || msg.contains("fashion") ||
                msg.contains("trending") || msg.contains("best") || msg.contains("under") ||
                msg.contains("cheap") || msg.contains("gift");
    }

    private AiChatResponse handleProductSearch(String msg) {
        List<Product> allProducts = productRepository.findAll();

        // Extract budget constraint if present (e.g. "under 300", "< 200", "below 500")
        Double maxBudget = null;
        Pattern pricePattern = Pattern.compile("(?:under|below|<|less than|max)\\s*\\$?(\\d+)");
        Matcher priceMatcher = pricePattern.matcher(msg);
        if (priceMatcher.find()) {
            try {
                maxBudget = Double.parseDouble(priceMatcher.group(1));
            } catch (Exception ignored) {}
        }

        final Double budgetLimit = maxBudget;

        // Filter products matching keywords and budget
        List<Product> matched = allProducts.stream()
                .filter(p -> {
                    if (budgetLimit != null && p.getPrice() > budgetLimit) return false;

                    String pName = p.getName().toLowerCase();
                    String pDesc = p.getDescription() != null ? p.getDescription().toLowerCase() : "";
                    String pBrand = p.getBrand().toLowerCase();
                    String pCat = p.getCategory() != null ? p.getCategory().getName().toLowerCase() : "";

                    // Check for key category or product matches
                    if (msg.contains("headphone") || msg.contains("audio") || msg.contains("earbud") || msg.contains("sound")) {
                        return pCat.contains("audio") || pName.contains("headphone") || pName.contains("speaker");
                    }
                    if (msg.contains("laptop") || msg.contains("computer") || msg.contains("workstation") || msg.contains("mac")) {
                        return pName.contains("laptop");
                    }
                    if (msg.contains("watch") || msg.contains("smartwatch") || msg.contains("duffel") || msg.contains("bag")) {
                        return pCat.contains("accessories") || pName.contains("watch") || pName.contains("duffel");
                    }
                    if (msg.contains("keyboard") || msg.contains("mech")) {
                        return pName.contains("keyboard");
                    }
                    if (msg.contains("chair") || msg.contains("desk") || msg.contains("lamp") || msg.contains("furniture") || msg.contains("coffee")) {
                        return pCat.contains("home") || pName.contains("chair") || pName.contains("lamp") || pName.contains("ceramic");
                    }
                    if (msg.contains("shoe") || msg.contains("running") || msg.contains("fitness") || msg.contains("kettlebell") || msg.contains("sport")) {
                        return pCat.contains("sports") || pName.contains("shoes") || pName.contains("kettlebell");
                    }
                    if (msg.contains("coat") || msg.contains("jacket") || msg.contains("wool") || msg.contains("fashion") || msg.contains("clothes")) {
                        return pCat.contains("fashion") || pName.contains("overcoat");
                    }

                    // Generic match: check if product name or brand is contained in query
                    for (String word : pName.split("\\s+")) {
                        if (word.length() > 3 && msg.contains(word)) return true;
                    }
                    return false;
                })
                .sorted(Comparator.comparing(Product::getRating).reversed())
                .limit(4)
                .collect(Collectors.toList());

        // If no strict keyword match, return top rated products matching budget
        if (matched.isEmpty()) {
            matched = allProducts.stream()
                    .filter(p -> budgetLimit == null || p.getPrice() <= budgetLimit)
                    .sorted(Comparator.comparing(Product::getRating).reversed())
                    .limit(4)
                    .collect(Collectors.toList());
        }

        List<ProductDto> productDtos = matched.stream().map(p -> ProductDto.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : "")
                .brand(p.getBrand())
                .imageUrl(p.getImageUrl())
                .stock(p.getStock())
                .rating(p.getRating())
                .build()).collect(Collectors.toList());

        String replyIntro = "I handpicked these **top-rated selections** from our catalog for you";
        if (budgetLimit != null) {
            replyIntro += " under **$" + String.format("%.0f", budgetLimit) + "**";
        }
        replyIntro += ":\n\nClick any card to view detailed specs or add it straight to your cart!";

        return AiChatResponse.builder()
                .intent("PRODUCT_RECOMMENDATIONS")
                .reply(replyIntro)
                .products(productDtos)
                .suggestedActions(List.of("View All Products", "Any Discounts Available?", "Check Cart"))
                .build();
    }

    private AiChatResponse handleGeneralConversation(User user, String msg) {
        String greeting = user != null ? "Hello " + user.getName() + "!" : "Hello there!";
        String reply = greeting + " I'm **Nova**, your personal AI shopping assistant. ✨\n\n" +
                "I can help you with:\n" +
                "• **Product Recommendations**: e.g., *'Find noise-cancelling headphones under $300'*\n" +
                "• **Order Tracking**: e.g., *'Track my latest package'*\n" +
                "• **Deals & Discounts**: e.g., *'What discount codes are available?'*\n" +
                "• **Shipping & Store Policies**: e.g., *'What is your return policy?'*\n\n" +
                "What can I help you discover today?";

        return AiChatResponse.builder()
                .intent("GREETING")
                .reply(reply)
                .suggestedActions(List.of(
                        "🔥 What's trending today?",
                        "🎧 Headphones under $300",
                        "🏷️ Any discount codes?",
                        "📦 Track my order"
                ))
                .build();
    }
}
