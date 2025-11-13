package com.crud.crud.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crud.crud.application.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}
