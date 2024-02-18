package com.mjtech.sandaga.dtos.search;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdsSuggestionsReqDto {
    private String keyword;
}
