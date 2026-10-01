package com.ecommerce.config;

import com.ecommerce.entity.*;
import com.ecommerce.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           CartRepository cartRepository,
                           OrderRepository orderRepository,
                           OrderItemRepository orderItemRepository,
                           ProductReviewRepository reviewRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data generation.");
            return;
        }

        log.info("Starting initial database seeding...");

        // 1. Create Default Users
        User admin = User.builder()
                .name("Admin User")
                .email("admin@ecommerce.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .build();
        User savedAdmin = userRepository.save(admin);
        cartRepository.save(Cart.builder().user(savedAdmin).build());

        User customer = User.builder()
                .name("Alex Johnson")
                .email("user@ecommerce.com")
                .password(passwordEncoder.encode("user123"))
                .role(Role.USER)
                .build();
        User savedCustomer = userRepository.save(customer);
        cartRepository.save(Cart.builder().user(savedCustomer).build());

        // 2. Create Categories
        Category electronics = categoryRepository.save(Category.builder()
                .name("Electronics")
                .description("Smartphones, laptops, monitors, and cutting-edge personal computing gear.")
                .build());

        Category fashion = categoryRepository.save(Category.builder()
                .name("Fashion")
                .description("Designer apparel, premium shoes, timeless accessories, and urban street style.")
                .build());

        Category audio = categoryRepository.save(Category.builder()
                .name("Audio & Gadgets")
                .description("Noise-cancelling headphones, wireless earbuds, smart speakers, and hi-fi audio.")
                .build());

        Category homeLiving = categoryRepository.save(Category.builder()
                .name("Home & Living")
                .description("Minimalist furniture, smart home lighting, ergonomic decor, and cozy kitchenware.")
                .build());

        Category sports = categoryRepository.save(Category.builder()
                .name("Sports & Fitness")
                .description("High-performance training gear, smart fitness trackers, yoga essentials, and outdoor accessories.")
                .build());

        Category accessories = categoryRepository.save(Category.builder()
                .name("Accessories")
                .description("Luxury watches, leather wallets, optical sunglasses, and everyday carry essentials.")
                .build());

        // 3. Create Products
        List<Product> products = new ArrayList<>();

        products.add(Product.builder()
                .name("Aura Pro Ultra ANC Wireless Headphones")
                .description("Industry-leading active noise cancellation with 40-hour battery life, spatial audio calibration, and ultra-soft plush memory foam ear cushions.")
                .price(299.99)
                .category(audio)
                .brand("SoundAura")
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80")
                .stock(45)
                .rating(4.8)
                .build());

        products.add(Product.builder()
                .name("Apex Horizon 16-inch M-Pro Laptop")
                .description("Supercharged workstation laptop featuring 32GB unified RAM, 1TB NVMe Gen4 SSD, Liquid Retina XDR screen, and up to 22 hours of continuous battery life.")
                .price(1899.00)
                .category(electronics)
                .brand("ApexTech")
                .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80")
                .stock(18)
                .rating(4.9)
                .build());

        products.add(Product.builder()
                .name("Nomad Chrono Titanium Smartwatch")
                .description("Aerospace-grade titanium chassis, sapphire crystal display, dual-frequency GPS, health biometrics suite, and 100m water resistance.")
                .price(449.50)
                .category(accessories)
                .brand("NomadGear")
                .imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80")
                .stock(28)
                .rating(4.7)
                .build());

        products.add(Product.builder()
                .name("Minimalist Japanese Mechanical Keyboard")
                .description("Hot-swappable tactile switches, frosted aluminum backplate, PBT double-shot keycaps, RGB backlighting, and Bluetooth 5.3 multi-device connectivity.")
                .price(139.00)
                .category(electronics)
                .brand("KeyCraft")
                .imageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80")
                .stock(32)
                .rating(4.6)
                .build());

        products.add(Product.builder()
                .name("Classic Heritage Merino Wool Overcoat")
                .description("Handcrafted from 100% Australian Merino wool. Tailored silhouette, satin lining, internal passport pocket, and horn buttons. Perfect for cold weather elegance.")
                .price(320.00)
                .category(fashion)
                .brand("NordicTailors")
                .imageUrl("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80")
                .stock(14)
                .rating(4.8)
                .build());

        products.add(Product.builder()
                .name("Lumina Smart Ambient Desk Lamp")
                .description("Circadian-synced natural daylight simulation, stepless touch dimming, 15W Qi wireless charging base, and sleek matte aluminum construction.")
                .price(89.99)
                .category(homeLiving)
                .brand("Lumina")
                .imageUrl("https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80")
                .stock(50)
                .rating(4.5)
                .build());

        products.add(Product.builder()
                .name("CloudStrider Velocity Elite Running Shoes")
                .description("Engineered breathable mesh upper with responsive carbon fiber propulsion plate and cloud-foam energy return cushioning.")
                .price(179.95)
                .category(sports)
                .brand("StriderLab")
                .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80")
                .stock(25)
                .rating(4.7)
                .build());

        products.add(Product.builder()
                .name("Vanguard Full-Grain Leather Weekender Duffel")
                .description("Vegetable-tanned full-grain leather, antique brass YKK hardware, dedicated ventilated shoe compartment, and padded shoulder strap.")
                .price(245.00)
                .category(accessories)
                .brand("Vanguard")
                .imageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80")
                .stock(9)
                .rating(4.9)
                .build());

        products.add(Product.builder()
                .name("EchoBass Studio Wireless Bluetooth Speaker")
                .description("360-degree immersive acoustic architecture, dual passive radiators, 24-hour battery, IPX7 waterproof rating, and rugged drop-proof fabric finish.")
                .price(159.00)
                .category(audio)
                .brand("SoundAura")
                .imageUrl("https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80")
                .stock(38)
                .rating(4.6)
                .build());

        products.add(Product.builder()
                .name("ErgoForm Zero-Gravity Executive Chair")
                .description("Dynamic lumbar response system, 4D adjustable armrests, breathable Korean mesh, synchronous tilt mechanism with lockable recline positions.")
                .price(499.00)
                .category(homeLiving)
                .brand("ErgoLife")
                .imageUrl("https://images.unsplash.com/photo-1580481077169-d4193566b74e?w=800&auto=format&fit=crop&q=80")
                .stock(8)
                .rating(4.8)
                .build());

        products.add(Product.builder()
                .name("Kinetics Pro Smart Adjustable Kettlebell")
                .description("Quick-dial weight adjustments from 8kg to 24kg in 2kg increments, ergonomic rubber grip handle, and non-slip durable rubber base.")
                .price(189.00)
                .category(sports)
                .brand("StriderLab")
                .imageUrl("https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80")
                .stock(20)
                .rating(4.7)
                .build());

        products.add(Product.builder()
                .name("Artisan Hand-Poured Ceramic Pour-Over Set")
                .description("Handcrafted stoneware dripper, heat-resistant borosilicate glass server, and reusable organic cotton filters for the consummate coffee enthusiast.")
                .price(65.00)
                .category(homeLiving)
                .brand("ArtisanCraft")
                .imageUrl("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80")
                .stock(40)
                .rating(4.4)
                .build());

        List<Product> savedProducts = productRepository.saveAll(products);

        // 4. Create Initial Reviews
        Product headphone = savedProducts.get(0);
        Product laptop = savedProducts.get(1);

        reviewRepository.save(ProductReview.builder()
                .user(savedCustomer)
                .product(headphone)
                .rating(5.0)
                .comment("Incredible noise cancellation! I use these on flights and in busy coffee shops—battery life easily lasts all week.")
                .build());

        reviewRepository.save(ProductReview.builder()
                .user(savedAdmin)
                .product(headphone)
                .rating(4.6)
                .comment("Extremely comfortable, beautiful design, and crystal clear mids and highs.")
                .build());

        reviewRepository.save(ProductReview.builder()
                .user(savedCustomer)
                .product(laptop)
                .rating(5.0)
                .comment("The display is jaw-droppingly gorgeous. Compiles massive codebases in seconds without breaking a sweat.")
                .build());

        // 5. Create Initial Order for Customer
        Order sampleOrder = Order.builder()
                .user(savedCustomer)
                .totalAmount(479.94)
                .status("DELIVERED")
                .shippingAddress("742 Evergreen Terrace, Springfield, IL 62704")
                .paymentStatus("PAID")
                .createdAt(LocalDateTime.now().minusDays(3))
                .build();
        Order savedOrder = orderRepository.save(sampleOrder);

        OrderItem item1 = OrderItem.builder()
                .order(savedOrder)
                .product(headphone)
                .quantity(1)
                .price(299.99)
                .build();

        OrderItem item2 = OrderItem.builder()
                .order(savedOrder)
                .product(savedProducts.get(6))
                .quantity(1)
                .price(179.95)
                .build();

        orderItemRepository.saveAll(List.of(item1, item2));

        log.info("Database seeding completed successfully! Seeded {} products.", savedProducts.size());
    }
}
