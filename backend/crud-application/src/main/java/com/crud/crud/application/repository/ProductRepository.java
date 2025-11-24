package com.crud.crud.application.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.crud.crud.application.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Search by product name (case-insensitive)
    List<Product> findByProductNameContainingIgnoreCase(String productName);

    // Search by category (case-insensitive)
    List<Product> findByCategoryContainingIgnoreCase(String category);

    // Search by product name or category
    @Query("SELECT p FROM Product p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchByKeyword(@Param("keyword") String keyword);
}
