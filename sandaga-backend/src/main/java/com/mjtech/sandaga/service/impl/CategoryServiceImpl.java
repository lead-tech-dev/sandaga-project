package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.entity.CategoryEntity;
import com.mjtech.sandaga.dtos.categories.*;
import com.mjtech.sandaga.repository.CategoryRepository;
import com.mjtech.sandaga.service.CategoryService;
import com.mjtech.sandaga.utility.dto.Category;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }


    @Override
    public List<CategoryEntity> getCategories() {
        return (List<CategoryEntity>) categoryRepository.findAll();
    }

    @Override
    public CategoryEntity createCategory(CategoryDto categoryDto) {
    return categoryRepository.save(Category.toEntity(categoryDto));
    }

    @Override
    public Optional<CategoryEntity> getCategory(String category) {
    return categoryRepository.findById(UUID.fromString(category));
    }

}
