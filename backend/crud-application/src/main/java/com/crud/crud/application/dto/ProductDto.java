package com.crud.crud.application.dto;

import com.crud.crud.application.entity.Product;

public class ProductDto {
    private Long id;
    private String name;
    private double price;
    private int quantity;
    private String category;
    private String description;

    public ProductDto() {
    }

    public ProductDto(String name, long price, int quantity, String category) {
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

    public double getPrice() {
        return price;
    }

    public void setPrice(long price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
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
        product.setCategory(this.category);
        product.setDescription(this.description);
        return product;
    }
}
