package com.mjtech.sandaga.dtos.search;

import com.mjtech.sandaga.dtos.favoite.FavoritesDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchListResDto {
    private int totalPages;
    private long totalItems;
    List<AdsSearchReqDto> searches;
}
