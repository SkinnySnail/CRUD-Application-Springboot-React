package com.crud.crud.application.controller;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.crud.crud.application.dto.ProductDto;
import com.crud.crud.application.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(ProductController.class)
@ContextConfiguration(classes = { ProductController.class })
@DisplayName("Product API Integration Tests")
class ProductControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @Test
    @DisplayName("TC_INTER_1: GET /products - Lấy danh sách sản phẩm")
    void testGetAllProducts() throws Exception {
        List<ProductDto> products = Arrays.asList(
                new ProductDto("Laptop", 15000000.0, 10, "Electronics"),
                new ProductDto("Mouse", 200000.0, 50, "Electronics")
        );
        products.get(0).setId(1L);
        products.get(1).setId(2L);
        when(productService.getAllProducts()).thenReturn(products);

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("Laptop"))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].name").value("Mouse"))
                .andExpect(jsonPath("$[1].id").value(2L));
    }

    @Test
    @DisplayName("TC_INTER_2: POST /product - Tạo sản phẩm mới")
    void testCreateProduct() throws Exception {
        ProductDto requestDto = new ProductDto("Laptop", 15000000.0, 10, "Electronics");
        ProductDto responseDto = new ProductDto("Laptop", 15000000.0, 10, "Electronics");
        responseDto.setId(1L);
        when(productService.createProduct(any(ProductDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/product")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Laptop"));
    }

    @Test
    @DisplayName("TC_INTER_3: GET /product/{id} - Lấy sản phẩm theo ID")
    void testGetProductById() throws Exception {
        ProductDto productDto = new ProductDto("Laptop", 15000000.0, 10, "Electronics");
        productDto.setId(1L);
        when(productService.getProductById(1L)).thenReturn(productDto);

        mockMvc.perform(get("/product/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Laptop"));
    }

    @Test
    @DisplayName("TC_INTER_4: PUT /product/{id} - Cập nhật sản phẩm")
    void testUpdateProduct() throws Exception {
        ProductDto updateDto = new ProductDto("Laptop Updated", 14000000.0, 15, "Electronics");
        ProductDto responseDto = new ProductDto("Laptop Updated", 14000000.0, 15, "Electronics");
        responseDto.setId(1L);
        when(productService.updateProduct(eq(1L), any(ProductDto.class))).thenReturn(responseDto);

        mockMvc.perform(put("/product/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Laptop Updated"));
    }

    @Test
    @DisplayName("TC_INTER_5: DELETE /product/{id} - Xóa sản phẩm")
    void testDeleteProduct() throws Exception {
        when(productService.deleteProduct(1L)).thenReturn(true);

        mockMvc.perform(delete("/product/1"))
                .andExpect(status().isOk());
    }
}