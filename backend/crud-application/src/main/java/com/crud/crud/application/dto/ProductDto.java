package com.crud.crud.application.dto;

import com.crud.crud.application.entity.Product;

public class ProductDto {
    private Long id;
    private String name;
    private Double price;
    private Integer quantity;
    private String category;
    private String description;

    public ProductDto() {
    }

    public ProductDto(String name, Double price, Integer quantity, String category) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Product toEntity() {
        Product product = new Product();
        product.setId(this.id);
        product.setProductName(this.name);
        product.setPrice(this.price);
        product.setQuantity(this.quantity);
        if (this.category != null) {
            product.setCategory(this.category);
        }
        product.setDescription(this.description);
        return product;
    }

    public static ProductDto fromEntity(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getProductName());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setCategory(product.getCategory());
        dto.setDescription(product.getDescription());
        return dto;
    }

    @Override
    public String toString() {
        return "ProductDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                ", category='" + category + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
