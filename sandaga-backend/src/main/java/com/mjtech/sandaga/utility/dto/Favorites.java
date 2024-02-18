package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.entity.FavoriteEntity;
import com.mjtech.sandaga.dtos.favoite.FavoritesDto;
import com.mjtech.sandaga.entity.AddressEntity;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Favorites {
    public static FavoritesDto toDto(FavoriteEntity e) {
        String imageName = null;
        if (Image.toDtoList(e.getAds().getImages()).size() != 0) {
            imageName = Image.toDtoList(e.getAds().getImages()).get(0).getName();
        }
        return FavoritesDto.builder()
                .id(String.valueOf(e.getId()))
                .adsId(String.valueOf(e.getAds().getId()))
                .subject(e.getAds().getSubject())
                .imageUrl(imageName)
                .categoryName(e.getAds().getCategory().getName())
                .categoryId(String.valueOf(e.getAds().getCategory().getId()))
                .createdAt(e.getAds().getCreatedAt())
                .build();
    }

    public static FavoritesDto toStringDto(FavoriteEntity e) {

        return FavoritesDto.builder()
                .id(String.valueOf(e.getId()))
                .adsId(String.valueOf(e.getAds().getId()))
                .build();
    }


    public static List<FavoritesDto> toDtoList(List<FavoriteEntity> favorites) {
        if (Objects.isNull(favorites)) {
            return Collections.emptyList();
        }
        return favorites.stream().map(e -> toDto(e)).collect(Collectors.toList());
    }

    public static List<FavoritesDto> toStringDtoList(List<FavoriteEntity> favorites) {
        if (Objects.isNull(favorites)) {
            return Collections.emptyList();
        }
        return favorites.stream().map(e -> toStringDto(e)).collect(Collectors.toList());
    }

}
