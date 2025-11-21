package com.crud.crud.application.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.crud.crud.application.dto.ProductDto;
import com.crud.crud.application.entity.Product;
import com.crud.crud.application.repository.ProductRepository;

@DisplayName("Product Service Unit Tests")
class ProductServiceUnitTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("TC1: Tao san pham moi thanh cong")
    void testCreateProduct() {
        // Arrange
        ProductDto productDto = new ProductDto(
                "Laptop", 15000000.0, 10, "Electronics");
        Product product = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");

        when(productRepository.save(any(Product.class)))
                .thenReturn(product);

        // Act
        Product result = productService.createProduct(productDto);
        // Assert
        assertNotNull(result);
        assertEquals("Laptop", result.getProductName());
        assertEquals(15000000.0, result.getPrice());
        assertEquals(10, result.getQuantity());
        assertEquals("Electronics", result.getCategory());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("TC2: Lay san pham theo ID thanh cong")
    void testGetProductById() {
        // Arrange
        Long productId = 1L;
        Product product = new Product(
                1L, "Laptop", 15000000.0, 10, "Electronics");

        when(productRepository.findById(productId))
                .thenReturn(Optional.of(product));

        // Act
        Product result = productService.getProductById(productId);

        // Assert
        assertNotNull(result);
        assertEquals(productId, result.getId());
        assertEquals("Laptop", result.getProductName());
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    @DisplayName("TC3: Lay san pham theo ID khong ton tai")
    void testGetProductByIdNotFound() {
        // Arrange
        Long productId = 999L;

        when(productRepository.findById(productId))
                .thenReturn(Optional.empty());

        // Act
        Product result = productService.getProductById(productId);

        // Assert
        assertNull(result);
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    @DisplayName("TC4: Cap nhat san pham thanh cong")
    void testUpdateProduct() {
        // Arrange
        Long productId = 1L;
        ProductDto updateDto = new ProductDto(
                "Laptop Updated", 14000000.0, 15, "Electronics");

        Product existingProduct = new Product(
                1L, "Laptop", 15000000.0, 10, "Electronics");

        Product updatedProduct = new Product(
                1L, "Laptop Updated", 14000000.0, 15, "Electronics");

        when(productRepository.findById(productId))
                .thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class)))
                .thenReturn(updatedProduct);

        // Act
        Product result = productService.updateProduct(productId, updateDto);

        // Assert
        assertNotNull(result);
        assertEquals("Laptop Updated", result.getProductName());
        assertEquals(14000000.0, result.getPrice());
        assertEquals(15, result.getQuantity());
        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("TC5: Cap nhat san pham khong ton tai")
    void testUpdateProductNotFound() {
        // Arrange
        Long productId = 999L;
        ProductDto updateDto = new ProductDto(
                "Laptop Updated", 14000000.0, 15, "Electronics");

        when(productRepository.findById(productId))
                .thenReturn(Optional.empty());

        // Act
        Product result = productService.updateProduct(productId, updateDto);

        // Assert
        assertNull(result);
        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("TC6: Xoa san pham thanh cong")
    void testDeleteProduct() {
        // Arrange
        Long productId = 1L;

        when(productRepository.existsById(productId))
                .thenReturn(true);
        doNothing().when(productRepository).deleteById(productId);

        // Act
        boolean result = productService.deleteProduct(productId);

        // Assert
        assertTrue(result);
        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, times(1)).deleteById(productId);
    }

    @Test
    @DisplayName("TC7: Xoa san pham khong ton tai")
    void testDeleteProductNotFound() {
        // Arrange
        Long productId = 999L;

        when(productRepository.existsById(productId))
                .thenReturn(false);

        // Act
        boolean result = productService.deleteProduct(productId);

        // Assert
        assertFalse(result);
        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, never()).deleteById(productId);
    }

    @Test
    @DisplayName("TC8: Lay tat ca san pham thanh cong")
    void testGetAllProducts() {
        // Arrange
        Product product1 = new Product(
                1L, "Laptop", 15000000.0, 10, "Electronics");
        Product product2 = new Product(
                2L, "Mouse", 500000.0, 20, "Electronics");
        List<Product> products = Arrays.asList(product1, product2);

        when(productRepository.findAll())
                .thenReturn(products);

        // Act
        List<Product> result = productService.getAllProducts();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Laptop", result.get(0).getProductName());
        assertEquals("Mouse", result.get(1).getProductName());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("TC9: Tao san pham voi category khong hop le")
    void testCreateProductInvalidCategory() {
        // Arrange
        ProductDto productDto = new ProductDto(
                "Laptop", 15000000.0, 10, "InvalidCategory");

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(productDto);
        });

        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("TC10: Cap nhat san pham voi gia tri null")
    void testUpdateProductWithNullValues() {
        // Arrange
        Long productId = 1L;
        ProductDto updateDto = new ProductDto();
        updateDto.setName(null);
        updateDto.setPrice(null);
        updateDto.setQuantity(null);
        updateDto.setCategory(null);

        Product existingProduct = new Product(
                1L, "Laptop", 15000000.0, 10, "Electronics");

        when(productRepository.findById(productId))
                .thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class)))
                .thenReturn(existingProduct);

        // Act
        Product result = productService.updateProduct(productId, updateDto);

        // Assert
        assertNotNull(result);
        // Values should remain unchanged
        assertEquals("Laptop", result.getProductName());
        assertEquals(15000000.0, result.getPrice());
        assertEquals(10, result.getQuantity());
        assertEquals("Electronics", result.getCategory());
        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(1)).save(any(Product.class));
    }
}