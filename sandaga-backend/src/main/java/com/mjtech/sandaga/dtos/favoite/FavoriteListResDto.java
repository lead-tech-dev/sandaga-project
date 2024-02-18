package com.mjtech.sandaga.dtos.favoite;

import com.mjtech.sandaga.dtos.ads.AdsSearchDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteListResDto {
    private int totalPages;
    private long totalItems;
    List<FavoritesDto> favorites;
}
