package com.crud.crud.application.controller;

import com.crud.crud.application.dto.ProductDto;
import com.crud.crud.application.entity.Product;
import com.crud.crud.application.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class ProductController {
    @Autowired
    private ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/product")
    ResponseEntity<Product> newProduct(@RequestBody ProductDto productDto) {
        Product product = productService.createProduct(productDto);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/products")
    ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/product/{id}")
    ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return product != null ? ResponseEntity.ok(product) : ResponseEntity.notFound().build();
    }

    @PutMapping("/product/{id}")
    ResponseEntity<Product> updateProduct(@RequestBody ProductDto productDto, @PathVariable Long id) {
        Product updatedProduct = productService.updateProduct(id, productDto);
        return updatedProduct != null ? ResponseEntity.ok(updatedProduct) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/product/{id}")
    ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        boolean deleted = productService.deleteProduct(id);
        return deleted ? ResponseEntity.ok("Product deleted successfully") : ResponseEntity.notFound().build();
    }

    @GetMapping("/products/search")
    @CrossOrigin("http://localhost:3000")
    ResponseEntity<List<Product>> searchProducts(@RequestParam(required = false) String keyword,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category) {
        List<Product> products;

        if (keyword != null && !keyword.trim().isEmpty()) {
            // Search by keyword (searches both name and category)
            products = productService.searchProducts(keyword);
        } else if (name != null && !name.trim().isEmpty()) {
            // Search by name only
            products = productService.searchByName(name);
        } else if (category != null && !category.trim().isEmpty()) {
            // Search by category only
            products = productService.searchByCategory(category);
        } else {
            // No search params, return all products
            products = productService.getAllProducts();
        }

        return ResponseEntity.ok(products);
    }
}
