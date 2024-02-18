package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.entity.CategoryEntity;
import com.mjtech.sandaga.entity.SubcategoryEntity;
import com.mjtech.sandaga.exception.ResourceNotFoundException;
import com.mjtech.sandaga.dtos.categories.*;
import com.mjtech.sandaga.repository.CategoryRepository;
import com.mjtech.sandaga.repository.SubcategoryRepository;
import com.mjtech.sandaga.service.SubcategoryService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class SubcategoryServiceImpl implements SubcategoryService {

    private final SubcategoryRepository subcategoryRepository;

    private final CategoryRepository categoryRepository;


public SubcategoryServiceImpl(SubcategoryRepository subcategoryRepository, CategoryRepository categoryRepository) {
    this.subcategoryRepository = subcategoryRepository;
this.categoryRepository = categoryRepository;}

    @Override
    public SubcategoryEntity createSubcategory(AddSubcategoryReqDto addSubcategoryReq) {
        return subcategoryRepository.save(toEntity(addSubcategoryReq));
    }

    @Override
    public SubcategoryEntity getSubcategoryByID(String id) {
        Optional<SubcategoryEntity> existsSubcategory = subcategoryRepository.findById(UUID.fromString(id));

        if(existsSubcategory.isEmpty()) {
            throw new ResourceNotFoundException("Subcategory not exists!");
        }

        return existsSubcategory.get();
    }
    private SubcategoryEntity toEntity(AddSubcategoryReqDto model) {
        Optional<CategoryEntity> category = categoryRepository.findById(UUID.fromString(model.getCategory_id()));

        if(category.isEmpty()) {
            throw new ResourceNotFoundException("Category not exists!");
        }

        SubcategoryEntity entity = new SubcategoryEntity();
        return entity.setLabel(model.getLabel()).setName(model.getName()).setChannel(model.getChannel()).setCategoryEntity(category.get());
    }

    @Override
    public void deleteSubcategoryByID(String id) {
        Optional<SubcategoryEntity> subcategory = subcategoryRepository.findById(UUID.fromString(id));

        if (subcategory.isEmpty()) {
            throw new ResourceNotFoundException("Category not found!");
        }

        subcategoryRepository.deleteById(UUID.fromString(id));
    }
}
