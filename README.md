# 🛍️ Modern E-Commerce Platform with Nova AI Concierge

A full-stack, enterprise-grade e-commerce web application featuring a modern React frontend with Tailwind CSS, a robust Spring Boot REST API backend with Spring Security and JWT, MySQL persistence, and an intelligent **Nova AI Shopping Concierge**.

---

## 🌟 Key Features

### 🛒 Customer Storefront
- **Home & Discovery**: Hero banner, category carousels, featured collections, best sellers, and trending products.
- **Product Catalog & Multi-Faceted Filtering**: Search, category filters, brand filters, price range sliders, minimum rating filters, sorting (Price, Newest, Rating), and pagination.
- **Product Details & Customer Reviews**: Image display, stock status, star ratings, interactive review submission, quantity selectors, and direct cart/wishlist toggles.
- **Shopping Cart & Checkout**: Real-time quantity adjustments, price calculations, order summaries, promo code support (`NOVA20` for 20% off), delivery address management, and instant order placement.
- **Order Tracking & History**: Status badges (Pending, Confirmed, Shipped, Delivered), item breakdowns, timestamps, and order details.
- **Wishlist & Customer Profile**: Saved items with direct add-to-cart, profile view with role badges.

### 🤖 Nova AI Shopping Concierge
- **Floating AI Widget**: Persistent bottom-right conversational shopping agent with smooth expandable drawer.
- **Intent Recognition & Catalog Search**: Natural language queries parsed for budget (`"under $300"`), categories, brands, or keywords.
- **Direct-to-Cart Action Cards**: Interactive rich cards returned in the chat stream with 1-click **Add to Cart** action.
- **Authenticated Order Tracking**: Inquiring about packages (`"Where is my order?"`) queries the customer's live orders and displays real-time delivery status.
- **Active Promotions & Knowledge**: Instant assistance with promo codes, shipping rates, and return policies.

### 🛡️ Admin Dashboard (`/admin`)
- **Real-Time Analytics**: Total revenue, total orders, catalog product count, registered user stats.
- **Product Management**: Full CRUD (add products, edit prices/stock/images, delete products).
- **Category Management**: Create, edit, and organize product categories.
- **Order Management**: Real-time order listing with instant status lifecycle updates (`PENDING` ➔ `CONFIRMED` ➔ `SHIPPED` ➔ `DELIVERED` ➔ `CANCELLED`).
- **User Management**: View customer registrations and manage roles (`USER`, `ADMIN`).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **State Management**: React Context API (`AuthContext`, `CartContext`, `WishlistContext`, `ToastContext`)
- **HTTP Client**: Axios with centralized request/response interceptors & JWT handling

### Backend
- **Framework**: Spring Boot 3.3.4 (Java 21 / 25)
- **Security**: Spring Security 6 with BCrypt password hashing & JWT token validation
- **Persistence**: Spring Data JPA & Hibernate
- **Database**: MySQL 8.0
- **Build Tool**: Maven

---

## 🚀 Getting Started

### Prerequisites
- Java JDK 21 or higher
- Node.js (v18+) & npm
- MySQL 8.0 running locally
- Git

### 1. Database Setup
Create the MySQL database:
```sql
CREATE DATABASE ecommerce_db;
```
Configure your credentials in `ecommerce-backend/src/main/resources/application.properties` if different from default `root/root`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```
*(On application startup, `DataInitializer` automatically creates tables and seeds sample categories, products, customer reviews, orders, and demo accounts).*

### 2. Backend Startup
```bash
cd ecommerce-backend
mvn spring-boot:run
```
Backend will start on: `http://localhost:8080`

### 3. Frontend Startup
```bash
cd ecommerce-frontend
npm install
npm run dev
```
Frontend will start on: `http://localhost:5173`

---

## 🔑 Test Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Customer** | `user@ecommerce.com` | `user123` | Browsing, Cart, Checkout, Order Tracking, AI Assistant |
| **Admin** | `admin@ecommerce.com` | `admin123` | Full Admin Dashboard (`/admin`), Products, Orders, Users |

*(Quick-fill buttons are also available on the Login screen).*

---

## 📡 Core API Endpoints

### Authentication
- `POST /api/auth/register` - Create new customer account
- `POST /api/auth/login` - Authenticate and receive JWT token

### Products & Categories
- `GET /api/products` - Filtered & paginated product catalog
- `GET /api/products/{id}` - Product details
- `POST /api/products` - Create product *(Admin)*
- `PUT /api/products/{id}` - Update product *(Admin)*
- `DELETE /api/products/{id}` - Delete product *(Admin)*
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category *(Admin)*

### Cart & Orders
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{id}` - Update cart item quantity
- `DELETE /api/cart/items/{id}` - Remove item from cart
- `POST /api/orders` - Place new order
- `GET /api/orders` - Get current user's orders
- `GET /api/orders/{id}` - Get order by ID

### AI Assistant
- `POST /api/ai/chat` - Chat with Nova AI shopping agent
- `GET /api/ai/suggestions` - Fetch quick prompt chips

### Admin Management
- `GET /api/admin/stats` - Total revenue, orders, products, users
- `GET /api/admin/orders` - View all customer orders
- `PUT /api/admin/orders/{id}/status` - Update order lifecycle status
- `GET /api/admin/users` - View registered users

---

## 📄 License
This project is open-source and available under the MIT License.
