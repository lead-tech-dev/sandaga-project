package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.categories.AddSubcategoryReqDto;
import com.mjtech.sandaga.dtos.categories.SubcategoryDto;
import com.mjtech.sandaga.entity.CategoryEntity;
import com.mjtech.sandaga.entity.SubcategoryEntity;
import com.mjtech.sandaga.exception.ResourceNotFoundException;

import java.util.*;
import java.util.stream.Collectors;

public class Subcategory {

    public static SubcategoryDto toDto(SubcategoryEntity e) {
        SubcategoryDto subcategoryDto = new SubcategoryDto();
        subcategoryDto.setId(e.getId().toString()).setLabel(e.getLabel()).setName(e.getName()).setChannel(e.getChannel());
        return subcategoryDto;
    }

    public static List<SubcategoryDto> toDtolList(List<SubcategoryEntity> subcategories) {
        if (Objects.isNull(subcategories)) {
            return Collections.emptyList();
        }
        return subcategories.stream().map(e -> toDto(e)).collect(Collectors.toList());
    }

    public static SubcategoryEntity toEntity(SubcategoryDto subcategoryDto) {

        SubcategoryEntity entity = new SubcategoryEntity();
        return entity
                .setLabel(subcategoryDto.getLabel())
                .setName(subcategoryDto.getName())
                .setChannel(subcategoryDto.getChannel());
    }

    public static List<SubcategoryEntity> toEntitylList(List<SubcategoryDto> subcategories) {
        if (Objects.isNull(subcategories)) {
            return Collections.emptyList();
        }
        return subcategories.stream().map(e -> toEntity(e)).collect(Collectors.toList());
    }

}
