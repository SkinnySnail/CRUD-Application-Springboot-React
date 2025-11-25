package com.crud.crud.application.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crud.crud.application.dto.ProductDto;
import com.crud.crud.application.entity.Product;
import com.crud.crud.application.repository.ProductRepository;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductService() {
        // Default constructor
    }

    /**
     * Create a new product
     * 
     * @param productDto product data to create
     * @return created product with ID
     */
    public Product createProduct(ProductDto productDto) {
        Product product = productDto.toEntity();
        return productRepository.save(product);
    }

    /**
     * Get product by ID
     * 
     * @param id product ID
     * @return product data or null if not found
     */
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    /**
     * Update product
     * 
     * @param id         product ID to update
     * @param productDto new product data
     * @return updated product
     */
    public Product updateProduct(Long id, ProductDto productDto) {
        return productRepository.findById(id).map(existingProduct -> {
            if (productDto.getName() != null && !productDto.getName().trim().isEmpty()) {
                existingProduct.setProductName(productDto.getName());
            }
            if (productDto.getPrice() != null && productDto.getPrice() > 0) {
                existingProduct.setPrice(productDto.getPrice());
            }
            if (productDto.getQuantity() != null && productDto.getQuantity() >= 0) {
                existingProduct.setQuantity(productDto.getQuantity());
            }
            if (productDto.getCategory() != null && !productDto.getCategory().trim().isEmpty()) {
                existingProduct.setCategory(productDto.getCategory());
            }
            if (productDto.getDescription() != null) {
                existingProduct.setDescription(productDto.getDescription());
            }
            return productRepository.save(existingProduct);
        }).orElse(null);
    }

    /**
     * Delete product
     * 
     * @param id product ID to delete
     * @return true if deleted, false if not found
     */
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Get all products
     * 
     * @return list of all products
     */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /**
     * Search products by keyword (searches in name and category)
     * 
     * @param keyword search keyword
     * @return list of matching products
     */
    public List<Product> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.searchByKeyword(keyword.trim());
    }

    /**
     * Search products by name
     * 
     * @param name product name
     * @return list of matching products
     */
    public List<Product> searchByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.findByProductNameContainingIgnoreCase(name.trim());
    }

    /**
     * Search products by category
     * 
     * @param category category name
     * @return list of matching products
     */
    public List<Product> searchByCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.findByCategoryContainingIgnoreCase(category.trim());
    }
}