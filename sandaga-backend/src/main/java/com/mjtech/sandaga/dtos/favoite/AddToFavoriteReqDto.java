package com.mjtech.sandaga.dtos.favoite;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddToFavoriteReqDto {
    private String adsId;
}
