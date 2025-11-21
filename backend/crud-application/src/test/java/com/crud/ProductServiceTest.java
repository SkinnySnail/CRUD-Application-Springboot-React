package com.crud;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.crud.crud.application.dto.ProductDto;
import com.crud.crud.application.entity.Product;
import com.crud.crud.application.repository.ProductRepository;
import com.crud.crud.application.service.ProductService;

@DisplayName("Product Service Unit Tests")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this); // Initialize mocks
    }

    @Test
    @DisplayName("TC_PRODUCT_BE_01: Tạo sản phẩm mới thành công")
    void testCreateProduct() {
        // Arrange
        ProductDto productDto = new ProductDto();
        productDto.setName("Laptop Dell");
        productDto.setPrice(15000000);
        productDto.setQuantity(10);
        productDto.setCategory("Electronics");

        Product product = productDto.toEntity();
        when(productRepository.save(any(Product.class))).thenReturn(product);

        // Act
        Product result = productService.createProduct(product);

        // Assert
        assertNotNull(result);
        assertEquals("Laptop Dell", result.getProductName());
        assertEquals(15000000, result.getPrice());
        assertEquals(10, result.getQuantity());
    }

    @Test
    @DisplayName("TC_PRODUCT_BE_02: Lấy sản phẩm theo ID thành công")
    void testGetProductById() {
        // Arrange
        Long productId = 1L;
        Product product = new Product();
        product.setId(productId);
        product.setProductName("Laptop Dell");
        product.setPrice(15000000.0);
        product.setQuantity(10);
        product.setCategory("Electronics");

        when(productRepository.findById(productId)).thenReturn(java.util.Optional.of(product));

        // Act
        Product result = productService.getProductById(productId);

        // Assert
        assertNotNull(result);
        assertEquals(productId, result.getId());
        assertEquals("Laptop Dell", result.getProductName());
    }

    @Test
    @DisplayName("TC_PRODUCT_BE_03: Cập nhật sản phẩm thành công")
    void testUpdateProduct() {
        // Arrange
        Long productId = 1L;
        Product existingProduct = new Product();
        existingProduct.setId(productId);
        existingProduct.setProductName("Laptop Dell");
        existingProduct.setPrice(15000000.0);
        existingProduct.setQuantity(10);
        existingProduct.setCategory("Electronics");

        Product updatedProduct = new Product();
        updatedProduct.setId(productId);
        updatedProduct.setProductName("Laptop Dell Updated");
        updatedProduct.setPrice(14000000.0);
        updatedProduct.setQuantity(15);
        updatedProduct.setCategory("Electronics");

        when(productRepository.findById(productId)).thenReturn(java.util.Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        // Act
        Product result = productService.updateProduct(productId, updatedProduct);

        // Assert
        assertNotNull(result);
        assertEquals("Laptop Dell Updated", result.getProductName());
        assertEquals(14000000.0, result.getPrice());
        assertEquals(15, result.getQuantity());
    }

    @Test
    @DisplayName("TC_PRODUCT_BE_04: Xóa sản phẩm thành công")
    void testDeleteProduct() {
        // Arrange
        Long productId = 1L;
        when(productRepository.existsById(productId)).thenReturn(true);
        doNothing().when(productRepository).deleteById(productId);

        // Act
        boolean result = productService.deleteProduct(productId);

        // Assert
        assertTrue(result);
        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, times(1)).deleteById(productId);
    }
}
