package com.ecommerce.dto;

import java.util.List;
import java.util.Map;

public class AdminStatsDto {
    private Long totalUsers;
    private Long totalProducts;
    private Long totalOrders;
    private Double totalRevenue;
    private Long lowStockProductsCount;
    private Long pendingOrdersCount;
    private List<OrderDto> recentOrders;
    private List<ProductDto> lowStockProducts;
    private Map<String, Long> categoryProductDistribution;

    public AdminStatsDto() {}

    public AdminStatsDto(Long totalUsers, Long totalProducts, Long totalOrders, Double totalRevenue,
                         Long lowStockProductsCount, Long pendingOrdersCount,
                         List<OrderDto> recentOrders, List<ProductDto> lowStockProducts,
                         Map<String, Long> categoryProductDistribution) {
        this.totalUsers = totalUsers;
        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.lowStockProductsCount = lowStockProductsCount;
        this.pendingOrdersCount = pendingOrdersCount;
        this.recentOrders = recentOrders;
        this.lowStockProducts = lowStockProducts;
        this.categoryProductDistribution = categoryProductDistribution;
    }

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getLowStockProductsCount() { return lowStockProductsCount; }
    public void setLowStockProductsCount(Long lowStockProductsCount) { this.lowStockProductsCount = lowStockProductsCount; }

    public Long getPendingOrdersCount() { return pendingOrdersCount; }
    public void setPendingOrdersCount(Long pendingOrdersCount) { this.pendingOrdersCount = pendingOrdersCount; }

    public List<OrderDto> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderDto> recentOrders) { this.recentOrders = recentOrders; }

    public List<ProductDto> getLowStockProducts() { return lowStockProducts; }
    public void setLowStockProducts(List<ProductDto> lowStockProducts) { this.lowStockProducts = lowStockProducts; }

    public Map<String, Long> getCategoryProductDistribution() { return categoryProductDistribution; }
    public void setCategoryProductDistribution(Map<String, Long> categoryProductDistribution) { this.categoryProductDistribution = categoryProductDistribution; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long totalUsers;
        private Long totalProducts;
        private Long totalOrders;
        private Double totalRevenue;
        private Long lowStockProductsCount;
        private Long pendingOrdersCount;
        private List<OrderDto> recentOrders;
        private List<ProductDto> lowStockProducts;
        private Map<String, Long> categoryProductDistribution;

        public Builder totalUsers(Long totalUsers) { this.totalUsers = totalUsers; return this; }
        public Builder totalProducts(Long totalProducts) { this.totalProducts = totalProducts; return this; }
        public Builder totalOrders(Long totalOrders) { this.totalOrders = totalOrders; return this; }
        public Builder totalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; return this; }
        public Builder lowStockProductsCount(Long lowStockProductsCount) { this.lowStockProductsCount = lowStockProductsCount; return this; }
        public Builder pendingOrdersCount(Long pendingOrdersCount) { this.pendingOrdersCount = pendingOrdersCount; return this; }
        public Builder recentOrders(List<OrderDto> recentOrders) { this.recentOrders = recentOrders; return this; }
        public Builder lowStockProducts(List<ProductDto> lowStockProducts) { this.lowStockProducts = lowStockProducts; return this; }
        public Builder categoryProductDistribution(Map<String, Long> categoryProductDistribution) { this.categoryProductDistribution = categoryProductDistribution; return this; }

        public AdminStatsDto build() {
            return new AdminStatsDto(totalUsers, totalProducts, totalOrders, totalRevenue, lowStockProductsCount, pendingOrdersCount, recentOrders, lowStockProducts, categoryProductDistribution);
        }
    }
}
