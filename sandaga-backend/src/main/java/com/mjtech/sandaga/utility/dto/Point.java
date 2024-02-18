package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.point.PointDto;
import com.mjtech.sandaga.entity.PointEntity;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Point {

    public static PointDto toDto(PointEntity e) {
        return PointDto.builder()
                .longitude(e.getLongitude())
                .latitude(e.getLatitude()).build();
    }
    public static List<PointDto> toDtoList(List<PointEntity> points) {
        if (Objects.isNull(points)) {
            return Collections.emptyList();
        }
        return points.stream().map(e -> toDto(e)).collect(Collectors.toList());
    }

    public static PointEntity toEntity(PointDto pointDto) {
        PointEntity entity = new PointEntity();
        entity.setLatitude(pointDto.getLatitude());
        entity.setLongitude(pointDto.getLongitude());
        return entity;
    }
}
