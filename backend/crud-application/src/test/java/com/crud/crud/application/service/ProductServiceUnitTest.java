package com.crud.crud.application.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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
        @DisplayName("TC_UNIT_1: Tao san pham moi thanh cong")
        void testCreateProduct() {
                // Arrange
                ProductDto productDto = new ProductDto(
                                "Laptop", 15000000.0, 10, "Electronics");
                Product product = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");

                when(productRepository.save(any(Product.class)))
                                .thenReturn(product);

                // Act
                ProductDto result = productService.createProduct(productDto);
                // Assert
                assertNotNull(result);
                assertEquals("Laptop", result.getName());
                assertEquals(15000000.0, result.getPrice());
                assertEquals(10, result.getQuantity());
                assertEquals("Electronics", result.getCategory());
                verify(productRepository, times(1)).save(any(Product.class));
        }

        @Test
        @DisplayName("TC_UNIT_2: Lay san pham theo ID thanh cong")
        void testGetProductById() {
                // Arrange
                Long productId = 1L;
                Product product = new Product(
                                1L, "Laptop", 15000000.0, 10, "Electronics");

                when(productRepository.findById(productId))
                                .thenReturn(Optional.of(product));

                // Act
                ProductDto result = productService.getProductById(productId);

                // Assert
                assertNotNull(result);
                assertEquals(productId, result.getId());
                assertEquals("Laptop", result.getName());
                verify(productRepository, times(1)).findById(productId);
        }

        @Test
        @DisplayName("TC_UNIT_3: Lay san pham theo ID khong ton tai")
        void testGetProductByIdNotFound() {
                // Arrange
                Long productId = 999L;

                when(productRepository.findById(productId))
                                .thenReturn(Optional.empty());

                // Act
                ProductDto result = productService.getProductById(productId);

                // Assert
                assertNull(result);
                verify(productRepository, times(1)).findById(productId);
        }

        @Test
        @DisplayName("TC_UNIT_4: Cap nhat san pham thanh cong")
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
                ProductDto result = productService.updateProduct(productId, updateDto);

                // Assert
                assertNotNull(result);
                assertEquals("Laptop Updated", result.getName());
                assertEquals(14000000.0, result.getPrice());
                assertEquals(15, result.getQuantity());
                verify(productRepository, times(1)).findById(productId);
                verify(productRepository, times(1)).save(any(Product.class));
        }

        @Test
        @DisplayName("TC_UNIT_5: Cap nhat san pham khong ton tai")
        void testUpdateProductNotFound() {
                // Arrange
                Long productId = 999L;
                ProductDto updateDto = new ProductDto(
                                "Laptop Updated", 14000000.0, 15, "Electronics");

                when(productRepository.findById(productId))
                                .thenReturn(Optional.empty());

                // Act
                ProductDto result = productService.updateProduct(productId, updateDto);

                // Assert
                assertNull(result);
                verify(productRepository, times(1)).findById(productId);
                verify(productRepository, never()).save(any(Product.class));
        }

        @Test
        @DisplayName("TC_UNIT_6: Xoa san pham thanh cong")
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
        @DisplayName("TC_UNIT_7: Xoa san pham khong ton tai")
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
        @DisplayName("TC_UNIT_8: Lay tat ca san pham thanh cong")
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
                List<ProductDto> result = productService.getAllProducts();

                // Assert
                assertNotNull(result);
                assertEquals(2, result.size());
                assertEquals("Laptop", result.get(0).getName());
                assertEquals("Mouse", result.get(1).getName());
                verify(productRepository, times(1)).findAll();
        }

        @Test
        @DisplayName("TC_UNIT_11: Lay tat ca san pham voi pagination")
        void testGetAllProductsWithPagination() {
                // Arrange
                Product product1 = new Product(
                                1L, "Laptop", 15000000.0, 10, "Electronics");
                Product product2 = new Product(
                                2L, "Mouse", 500000.0, 20, "Electronics");
                Product product3 = new Product(
                                3L, "Keyboard", 800000.0, 15, "Electronics");
                List<Product> allProducts = Arrays.asList(product1, product2, product3);
                
                // Page 0, size 2
                Pageable pageable = PageRequest.of(0, 2);
                List<Product> pageProducts = Arrays.asList(product1, product2);
                Page<Product> productPage = new PageImpl<>(pageProducts, pageable, allProducts.size());

                when(productRepository.findAll(pageable))
                                .thenReturn(productPage);

                // Act
                Page<ProductDto> result = productService.getAllProducts(pageable);

                // Assert
                assertNotNull(result);
                assertEquals(2, result.getContent().size()); // Page size = 2
                assertEquals(3, result.getTotalElements()); // Total elements = 3
                assertEquals(2, result.getTotalPages()); // Total pages = 2 (3 items / 2 per page)
                assertEquals(0, result.getNumber()); // Current page = 0
                assertEquals("Laptop", result.getContent().get(0).getName());
                assertEquals("Mouse", result.getContent().get(1).getName());
                verify(productRepository, times(1)).findAll(pageable);
        }

        @Test
        @DisplayName("TC_UNIT_12: Lay tat ca san pham voi pagination - page 2")
        void testGetAllProductsWithPaginationPage2() {
                // Arrange
                Product product1 = new Product(
                                1L, "Laptop", 15000000.0, 10, "Electronics");
                Product product2 = new Product(
                                2L, "Mouse", 500000.0, 20, "Electronics");
                Product product3 = new Product(
                                3L, "Keyboard", 800000.0, 15, "Electronics");
                List<Product> allProducts = Arrays.asList(product1, product2, product3);
                
                // Page 1, size 2 (second page)
                Pageable pageable = PageRequest.of(1, 2);
                List<Product> pageProducts = Arrays.asList(product3);
                Page<Product> productPage = new PageImpl<>(pageProducts, pageable, allProducts.size());

                when(productRepository.findAll(pageable))
                                .thenReturn(productPage);

                // Act
                Page<ProductDto> result = productService.getAllProducts(pageable);

                // Assert
                assertNotNull(result);
                assertEquals(1, result.getContent().size()); // Page size = 1 (last page)
                assertEquals(3, result.getTotalElements()); // Total elements = 3
                assertEquals(2, result.getTotalPages()); // Total pages = 2
                assertEquals(1, result.getNumber()); // Current page = 1
                assertEquals("Keyboard", result.getContent().get(0).getName());
                verify(productRepository, times(1)).findAll(pageable);
        }

        @Test
        @DisplayName("TC_UNIT_9: Tao san pham voi category khong hop le")
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
        @DisplayName("TC_UNIT_10: Cap nhat san pham voi gia tri null")
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
                ProductDto result = productService.updateProduct(productId, updateDto);

                // Assert
                assertNotNull(result);
                // Values should remain unchanged
                assertEquals("Laptop", result.getName());
                assertEquals(15000000.0, result.getPrice());
                assertEquals(10, result.getQuantity());
                assertEquals("Electronics", result.getCategory());
                verify(productRepository, times(1)).findById(productId);
                verify(productRepository, times(1)).save(any(Product.class));
        }

        @Test
        @DisplayName("TC_UNIT_13: Search products by keyword - Tim thay")
        void testSearchProducts_WithKeyword() {
                // Arrange
                String keyword = "Laptop";
                Product product1 = new Product(1L, "Laptop Dell", 15000000.0, 10, "Electronics");
                Product product2 = new Product(2L, "Laptop HP", 12000000.0, 5, "Electronics");
                List<Product> products = Arrays.asList(product1, product2);

                when(productRepository.searchByKeyword(keyword)).thenReturn(products);

                // Act
                List<ProductDto> result = productService.searchProducts(keyword);

                // Assert
                assertNotNull(result);
                assertEquals(2, result.size());
                assertEquals("Laptop Dell", result.get(0).getName());
                verify(productRepository, times(1)).searchByKeyword(keyword);
        }

        @Test
        @DisplayName("TC_UNIT_14: Search products by keyword - Keyword rong")
        void testSearchProducts_WithEmptyKeyword() {
                // Arrange
                String keyword = "";
                Product product1 = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
                List<Product> allProducts = Arrays.asList(product1);

                when(productRepository.findAll()).thenReturn(allProducts);

                // Act
                List<ProductDto> result = productService.searchProducts(keyword);

                // Assert
                assertNotNull(result);
                assertEquals(1, result.size());
                verify(productRepository, times(1)).findAll();
                verify(productRepository, never()).searchByKeyword(any());
        }

        @Test
        @DisplayName("TC_UNIT_15: Search products by keyword - Keyword null")
        void testSearchProducts_WithNullKeyword() {
                // Arrange
                Product product1 = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
                List<Product> allProducts = Arrays.asList(product1);

                when(productRepository.findAll()).thenReturn(allProducts);

                // Act
                List<ProductDto> result = productService.searchProducts(null);

                // Assert
                assertNotNull(result);
                assertEquals(1, result.size());
                verify(productRepository, times(1)).findAll();
                verify(productRepository, never()).searchByKeyword(any());
        }

        @Test
        @DisplayName("TC_UNIT_16: Search products by name - Tim thay")
        void testSearchByName_Found() {
                // Arrange
                String name = "Laptop";
                Product product1 = new Product(1L, "Laptop Dell", 15000000.0, 10, "Electronics");
                List<Product> products = Arrays.asList(product1);

                when(productRepository.findByProductNameContainingIgnoreCase(name)).thenReturn(products);

                // Act
                List<ProductDto> result = productService.searchByName(name);

                // Assert
                assertNotNull(result);
                assertEquals(1, result.size());
                assertEquals("Laptop Dell", result.get(0).getName());
                verify(productRepository, times(1)).findByProductNameContainingIgnoreCase(name);
        }

        @Test
        @DisplayName("TC_UNIT_17: Search products by name - Name rong")
        void testSearchByName_EmptyName() {
                // Arrange
                String name = "";
                Product product1 = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
                List<Product> allProducts = Arrays.asList(product1);

                when(productRepository.findAll()).thenReturn(allProducts);

                // Act
                List<ProductDto> result = productService.searchByName(name);

                // Assert
                assertNotNull(result);
                assertEquals(1, result.size());
                verify(productRepository, times(1)).findAll();
                verify(productRepository, never()).findByProductNameContainingIgnoreCase(any());
        }

        @Test
        @DisplayName("TC_UNIT_18: Search products by category - Tim thay")
        void testSearchByCategory_Found() {
                // Arrange
                String category = "Electronics";
                Product product1 = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
                Product product2 = new Product(2L, "Mouse", 500000.0, 20, "Electronics");
                List<Product> products = Arrays.asList(product1, product2);

                when(productRepository.findByCategoryContainingIgnoreCase(category)).thenReturn(products);

                // Act
                List<ProductDto> result = productService.searchByCategory(category);

                // Assert
                assertNotNull(result);
                assertEquals(2, result.size());
                verify(productRepository, times(1)).findByCategoryContainingIgnoreCase(category);
        }

        @Test
        @DisplayName("TC_UNIT_19: Search products by category - Category rong")
        void testSearchByCategory_EmptyCategory() {
                // Arrange
                String category = "";
                Product product1 = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
                List<Product> allProducts = Arrays.asList(product1);

                when(productRepository.findAll()).thenReturn(allProducts);

                // Act
                List<ProductDto> result = productService.searchByCategory(category);

                // Assert
                assertNotNull(result);
                assertEquals(1, result.size());
                verify(productRepository, times(1)).findAll();
                verify(productRepository, never()).findByCategoryContainingIgnoreCase(any());
        }

        @Test
        @DisplayName("TC_UNIT_20: ProductService default constructor")
        void testProductServiceDefaultConstructor() {
                // Act
                ProductService service = new ProductService();

                // Assert
                assertNotNull(service);
        }
}