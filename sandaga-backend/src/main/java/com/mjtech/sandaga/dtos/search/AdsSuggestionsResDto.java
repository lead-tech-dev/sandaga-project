package com.mjtech.sandaga.dtos.search;


import com.mjtech.sandaga.dtos.categories.SubcategoryDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdsSuggestionsResDto {
    private String body;
    private String categoryLabel;

    private String categoryId;
}
