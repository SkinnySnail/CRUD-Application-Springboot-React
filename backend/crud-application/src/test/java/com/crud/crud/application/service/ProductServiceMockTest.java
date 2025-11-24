package com.crud.crud.application.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import com.crud.crud.application.dto.ProductDto;
import com.crud.crud.application.entity.Product;
import com.crud.crud.application.repository.ProductRepository;

/**
 * Service layer tests với mocked repository
 * - Mock ProductRepository để test business logic
 * - Verify repository interactions
 * - Test các scenarios: success, not found, edge cases
 */
@DisplayName("Product Service Mock Tests")
class ProductServiceMockTest {

    // a) Mock ProductRepository
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // b) Test service layer với mocked repository
    @Test
    @DisplayName("TC_MOCK_1: getProductById - Tìm thấy sản phẩm")
    void testGetProductById_Found() {
        // Arrange
        Long productId = 1L;
        Product mockProduct = new Product(productId, "Laptop", 15000000.0, 10, "Electronics");
        when(productRepository.findById(productId)).thenReturn(Optional.of(mockProduct));

        // Act
        Product result = productService.getProductById(productId);

        // Assert
        assertNotNull(result);
        assertEquals(productId, result.getId());
        assertEquals("Laptop", result.getProductName());
        assertEquals(15000000.0, result.getPrice());
        assertEquals(10, result.getQuantity());

        // Verify repository interactions
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    @DisplayName("TC_MOCK_2: getProductById - Không tìm thấy sản phẩm")
    void testGetProductById_NotFound() {
        // Arrange
        Long productId = 999L;
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // Act
        Product result = productService.getProductById(productId);

        // Assert
        assertNull(result);

        // Verify repository interactions
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    @DisplayName("TC_MOCK_3: - Tạo sản phẩm thành công")
    void testCreateProduct_Success() {
        // Arrange
        ProductDto productDto = new ProductDto("Mouse", 200000.0, 50, "Electronics");
        Product savedProduct = new Product(1L, "Mouse", 200000.0, 50, "Electronics");
        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        // Act
        Product result = productService.createProduct(productDto);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Mouse", result.getProductName());
        assertEquals(200000.0, result.getPrice());

        // Verify repository interactions
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("TC_MOCK_3: - Cập nhật thành công")
    void testUpdateProduct_Success() {
        // Arrange
        Long productId = 1L;
        ProductDto updateDto = new ProductDto("Laptop Updated", 14000000.0, 15, "Electronics");
        Product existingProduct = new Product(productId, "Laptop", 15000000.0, 10, "Electronics");
        Product updatedProduct = new Product(productId, "Laptop Updated", 14000000.0, 15, "Electronics");

        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        // Act
        Product result = productService.updateProduct(productId, updateDto);

        // Assert
        assertNotNull(result);
        assertEquals("Laptop Updated", result.getProductName());
        assertEquals(14000000.0, result.getPrice());
        assertEquals(15, result.getQuantity());

        // Verify repository interactions
        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("TC_MOCK_4: updateProduct - Không tìm thấy sản phẩm")
    void testUpdateProduct_NotFound() {
        // Arrange
        Long productId = 999L;
        ProductDto updateDto = new ProductDto("Laptop", 14000000.0, 15, "Electronics");
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // Act
        Product result = productService.updateProduct(productId, updateDto);

        // Assert
        assertNull(result);

        // Verify repository interactions
        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("TC_MOCK_5: deleteProduct - Xóa thành công")
    void testDeleteProduct_Success() {
        // Arrange
        Long productId = 1L;
        when(productRepository.existsById(productId)).thenReturn(true);
        doNothing().when(productRepository).deleteById(productId);

        // Act
        boolean result = productService.deleteProduct(productId);

        // Assert
        assertTrue(result);

        // Verify repository interactions
        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, times(1)).deleteById(productId);
    }

    @Test
    @DisplayName("TC_MOCK_6: deleteProduct - Không tìm thấy sản phẩm")
    void testDeleteProduct_NotFound() {
        // Arrange
        Long productId = 999L;
        when(productRepository.existsById(productId)).thenReturn(false);

        // Act
        boolean result = productService.deleteProduct(productId);

        // Assert
        assertFalse(result);

        // Verify repository interactions
        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("TC_MOCK_7: getAllProducts - Lấy danh sách sản phẩm")
    void testGetAllProducts() {
        // Arrange
        List<Product> mockProducts = Arrays.asList(
                new Product(1L, "Laptop", 15000000.0, 10, "Electronics"),
                new Product(2L, "Mouse", 200000.0, 50, "Electronics"),
                new Product(3L, "Keyboard", 500000.0, 30, "Electronics"));
        when(productRepository.findAll()).thenReturn(mockProducts);

        // Act
        List<Product> result = productService.getAllProducts();

        // Assert
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals("Laptop", result.get(0).getProductName());
        assertEquals("Mouse", result.get(1).getProductName());
        assertEquals("Keyboard", result.get(2).getProductName());

        // Verify repository interactions
        verify(productRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("TC_MOCK_8: getAllProducts - Danh sách rỗng")
    void testGetAllProducts_Empty() {
        // Arrange
        when(productRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<Product> result = productService.getAllProducts();

        // Assert
        assertNotNull(result);
        assertEquals(0, result.size());

        // Verify repository interactions
        verify(productRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("TC_MOCK_9: updateProduct - Cập nhật một phần (partial update)")
    void testUpdateProduct_PartialUpdate() {
        // Arrange
        Long productId = 1L;
        ProductDto updateDto = new ProductDto();
        updateDto.setPrice(12000000.0); // Chỉ update giá

        Product existingProduct = new Product(productId, "Laptop", 15000000.0, 10, "Electronics");
        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Product result = productService.updateProduct(productId, updateDto);

        // Assert
        assertNotNull(result);
        assertEquals("Laptop", result.getProductName()); // Tên không đổi
        assertEquals(12000000.0, result.getPrice()); // Giá đã thay đổi
        assertEquals(10, result.getQuantity()); // Số lượng không đổi

        // Verify repository interactions
        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(1)).save(any(Product.class));
    }
}
