package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.image.ImageDto;
import com.mjtech.sandaga.entity.ImageEntity;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

public class Image {


    public static ImageDto toDto(ImageEntity e) {

        return ImageDto.builder()
                .id(e.getId().toString())
                .name(e.getName())
                .imageUrl(e.getUrl())
                .build();
    }

    public static ImageEntity toEntity(ImageDto e) {
        return ImageEntity.builder()
                .id(UUID.fromString(e.getId()))
                .name(e.getName())
                .url(e.getImageUrl())
                .build();
    }


    public static List<ImageDto> toDtoList(List<ImageEntity> images) {
        if (Objects.isNull(images)) {
            return Collections.emptyList();
        }
        return images.stream().map(e -> toDto(e)).collect(Collectors.toList());
    }
}
