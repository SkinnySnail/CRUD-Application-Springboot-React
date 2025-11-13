package com.crud.crud.application.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crud.crud.application.entity.Product;
import com.crud.crud.application.repository.ProductRepository;;

@Service
public class ProductService {
    @Autowired
    private ProductRepository ProductRepository;

    public ProductService(ProductRepository productRepository) {
        ProductRepository = productRepository;
    }

    public ProductService() {
        // TODO Auto-generated constructor stub
    }

    /**
     * Create a new product
     * 
     * @param productDto product data to create
     * @return created product with ID
     */
    public Product createProduct(Product product) {
        return ProductRepository.save(product);
    }

    /**
     * Get product by ID
     * 
     * @param id product ID
     * @return product data or null if not found
     */
    public Product getProductById(Long id) {
        return ProductRepository.findById(id).orElse(null);
    }

    /**
     * Update product
     * 
     * @param id        product ID to update
     * @param updateDto new product data
     * @return updated product
     */
    public Product updateProduct(Long id, Product updateProduct) {
        return ProductRepository.findById(id).map(existingProduct -> {
            if (updateProduct.getProductName() != null) {
                existingProduct.setProductName(updateProduct.getProductName());
            }
            if (updateProduct.getPrice() > 0) {
                existingProduct.setPrice(updateProduct.getPrice());
            }
            if (updateProduct.getQuantity() >= 0) {
                existingProduct.setQuantity(updateProduct.getQuantity());
            }
            if (updateProduct.getCategory() != null) {
                existingProduct.setCategory(updateProduct.getCategory());
            }
            if (updateProduct.getDescription() != null) {
                existingProduct.setDescription(updateProduct.getDescription());
            }
            return ProductRepository.save(existingProduct);
        }).orElse(null);
    }

    /**
     * Delete product
     * 
     * @param id product ID to delete
     * @return true if deleted, false if not found
     */
    public boolean deleteProduct(Long id) {
        if (ProductRepository.existsById(id)) {
            ProductRepository.deleteById(id);
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
        return ProductRepository.findAll();
    }
}
