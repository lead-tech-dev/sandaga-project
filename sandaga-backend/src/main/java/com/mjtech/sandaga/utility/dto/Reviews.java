package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.image.ImageDto;
import com.mjtech.sandaga.dtos.reviews.ReviewDto;
import com.mjtech.sandaga.dtos.reviews.ReviewResDto;
import com.mjtech.sandaga.entity.ImageEntity;
import com.mjtech.sandaga.entity.ReviewEntity;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

public class Reviews {


    public static ReviewResDto toResDto(ReviewEntity e) {
        return ReviewResDto.builder()
                .name(e.getName())
                .review(e.getReview())
                .rating(e.getRating())
                .build();
    }

    public static ReviewDto toDto(List<ReviewEntity> reviews) {
        int sum = reviews.stream()
                .map(ReviewEntity::getRating)
                .reduce(0, Integer::sum);

        int size = reviews.size();

        return ReviewDto.builder()
                .count(size)
                .average((double) sum / size)
                .build();
    }



}
