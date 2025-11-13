package com.crud.crud.application.repository;


import com.crud.crud.application.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;



public interface ProductRepository extends JpaRepository<Product,Long> {
}

