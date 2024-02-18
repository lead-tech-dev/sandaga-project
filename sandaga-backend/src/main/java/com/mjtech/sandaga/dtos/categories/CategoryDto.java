package com.mjtech.sandaga.dtos.categories;


import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDto {
    private String id;
    private String label;
    private String name;
    private String channel;

    private List<SubcategoryDto> subcategories;

    public CategoryDto setId(String id) {
    this.id = id;
        return this;
}
public CategoryDto setLabel(String label) {
    this.label = label;
    return this;
}
public CategoryDto setName(String name) {
    this.name = name;
    return this;
}
public CategoryDto setChannel(String channel) {
    this.channel = channel;
    return this;
}

public CategoryDto setSubcategories(List<SubcategoryDto> subcategories) {
    this.subcategories = subcategories;
    return this;
}
}
