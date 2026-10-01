package com.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryDto {
    private Long id;

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    private Long productCount;

    public CategoryDto() {}

    public CategoryDto(Long id, String name, String description, Long productCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.productCount = productCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getProductCount() { return productCount; }
    public void setProductCount(Long productCount) { this.productCount = productCount; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String description;
        private Long productCount;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder productCount(Long productCount) { this.productCount = productCount; return this; }

        public CategoryDto build() {
            return new CategoryDto(id, name, description, productCount);
        }
    }
}
