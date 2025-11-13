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

        // Act
        Product result = productService.getProductById(productId);

        // Assert
        assertNotNull(result);
        assertEquals(productId, result.getId());
    }

    @Test
    @DisplayName("TC_PRODUCT_BE_03: Cập nhật sản phẩm thành công")
    void testUpdateProduct() {
        // Arrange
        Long productId = 1L;
        ProductDto updateDto = new ProductDto();
        updateDto.setName("Laptop Dell Updated");
        updateDto.setPrice(14000000);
        updateDto.setQuantity(15);

        // Act
        Product result = productService.updateProduct(productId, updateDto.toEntity());

        // Assert
        assertNotNull(result);
        assertEquals("Laptop Dell Updated", result.getProductName());
        assertEquals(14000000, result.getPrice());
    }

    @Test
    @DisplayName("TC_PRODUCT_BE_04: Xóa sản phẩm thành công")
    void testDeleteProduct() {
        // Arrange
        Long productId = 1L;

        // Act
        boolean result = productService.deleteProduct(productId);

        // Assert
        assertTrue(result);
    }
}
