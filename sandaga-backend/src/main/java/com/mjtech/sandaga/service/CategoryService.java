package com.mjtech.sandaga.service;

import com.mjtech.sandaga.entity.CategoryEntity;
import com.mjtech.sandaga.dtos.categories.*;

import java.util.List;
import java.util.Optional;


public interface CategoryService {
    List<CategoryEntity> getCategories();

    CategoryEntity createCategory(CategoryDto categoryDto);

    Optional<CategoryEntity> getCategory(String category);
}
