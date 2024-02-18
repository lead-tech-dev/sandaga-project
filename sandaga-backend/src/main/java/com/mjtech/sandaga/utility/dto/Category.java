package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.categories.CategoryDto;
import com.mjtech.sandaga.entity.CategoryEntity;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Category {

    public static CategoryEntity toEntity(CategoryDto categoryDto) {
        CategoryEntity entity = new CategoryEntity();
        return entity
                .setLabel(categoryDto.getLabel())
                .setName(categoryDto.getName())
                .setChannel(categoryDto.getChannel())
                .setSubcategories(Subcategory.toEntitylList(categoryDto.getSubcategories()));
    }

    public static CategoryDto toDto(CategoryEntity e) {
        CategoryDto m = new CategoryDto();
        m.setId(e.getId().toString()).setLabel(e.getLabel()).setName(e.getName()).setChannel(e.getChannel());
        return m;
    }


    public static List<CategoryDto> toDtoList(List<CategoryEntity> categories) {
        if (Objects.isNull(categories)) {
            return Collections.emptyList();
        }
        return categories.stream().map(e -> toDto(e)).collect(Collectors.toList());
    }
}
