package com.crud.crud.application.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.List;

@Entity
public class Product {

    @Id
    @GeneratedValue
    private Long id;

    @NotBlank
    @Size(min = 3, max = 100)
    private String productName;

    @DecimalMin(value = "0.01", inclusive = true)
    @DecimalMax(value = "999999999", inclusive = true)
    private Double price;

    @Min(0)
    @Max(99999)
    private Integer quantity;

    @Size(max = 500)
    private String description;

    @NotBlank
    private String category;

    private static final List<String> VALID_CATEGORIES = List.of("Electronics", "Books", "Clothing", "Home", "Toys",
            "Food");

    public Product(Long id, @NotBlank @Size(min = 3, max = 100) String productName,
            @DecimalMin(value = "0.01", inclusive = true) @DecimalMax(value = "999999999", inclusive = true) Double price,
            @Min(0) @Max(99999) Integer quantity, @Size(max = 500) String description, @NotBlank String category) {
        this.id = id;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.category = category;
    }

    public Product(Long id, @NotBlank @Size(min = 3, max = 100) String productName,
            @DecimalMin(value = "0.01", inclusive = true) @DecimalMax(value = "999999999", inclusive = true) Double price,
            @Min(0) @Max(99999) Integer quantity, @NotBlank String category) {
        this.id = id;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
    }

    public Product() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        if (!VALID_CATEGORIES.contains(category)) {
            throw new IllegalArgumentException("Invalid category: " + category);
        }
        this.category = category;
    }
}
