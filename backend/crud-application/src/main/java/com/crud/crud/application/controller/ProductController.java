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
        Product product = productService.createProduct(productDto.toEntity());
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
        Product updatedProduct = productService.updateProduct(id, productDto.toEntity());
        return updatedProduct != null ? ResponseEntity.ok(updatedProduct) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/product/{id}")
    ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        boolean deleted = productService.deleteProduct(id);
        return deleted ? ResponseEntity.ok("Product deleted successfully") : ResponseEntity.notFound().build();
    }
}
