package com.mjtech.sandaga.dtos.favoite;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteListReqDto {
    private int currentPage;
    private int limit;
}
