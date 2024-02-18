package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.favoite.FavoritesDto;
import com.mjtech.sandaga.dtos.search.*;
import com.mjtech.sandaga.entity.FavoriteEntity;
import com.mjtech.sandaga.entity.SearchEntity;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

public class Search {

    public static SearchEntity toEntity(AdsSearchReqDto adsSearchReqDto) {
        return SearchEntity.builder()
                .id(UUID.fromString(adsSearchReqDto.getId()))
                .category(adsSearchReqDto.getFilters().getCategory())
                .text(adsSearchReqDto.getFilters().getKeywords().getText())
                .location(
                        adsSearchReqDto.getFilters().getLocation().getCity() + "_" +
                        adsSearchReqDto.getFilters().getLocation().getPoint().getLat() + "_" +
                        adsSearchReqDto.getFilters().getLocation().getPoint().getLng() + "_" +
                        adsSearchReqDto.getFilters().getLocation().getPoint().getRadius()
                )
                .max(String.valueOf(adsSearchReqDto.getFilters().getRanges().getPrice().getMax()))
                .min(String.valueOf(adsSearchReqDto.getFilters().getRanges().getPrice().getMin()))
                .criteria(Criteria.toEntity(Criteria.criteriaReqToDto(adsSearchReqDto.getFilters().getCriteria())))
                .sort(adsSearchReqDto.getSort())
                .order(adsSearchReqDto.getOrder())
                .limit(adsSearchReqDto.getLimit())
                .currentPage(adsSearchReqDto.getCurrentPage())
                .build();
    }
    public static AdsSearchReqDto toDto(SearchEntity e) {
        String category = null;
        KeywordsReq keywords = null;
        LocationReq location = null;
        RangesReq ranges = null;
        if (e.getLocation() != null) {
           location = LocationReq.builder()
                    .city(e.getLocation().split("_")[0])
                    .point(PointReqDto.builder()
                            .lng(Double.parseDouble(e.getLocation().split("_")[2]))
                            .lat(Double.parseDouble(e.getLocation().split("_")[1]))
                            .radius(Integer.parseInt(e.getLocation().split("_")[3]))
                            .build())
                    .build();
        }
        if (e.getMin() != null && e.getMax() != null) {
            ranges = RangesReq.builder()
                    .price(PriceReq.builder()
                            .max(Double.parseDouble(e.getMax()))
                            .min(Double.parseDouble(e.getMin()))
                            .build())
                    .build();
        } else if (e.getMax() != null) {
               ranges = RangesReq.builder()
                       .price(PriceReq.builder()
                               .max(Double.parseDouble(e.getMax()))
                               .build())
                       .build();
        } else if (e.getMin() != null) {
            ranges = RangesReq.builder()
                    .price(PriceReq.builder()
                            .min(Double.parseDouble(e.getMin()))
                            .build())
                    .build();
        }
        if (e.getText() != null) {
            keywords = KeywordsReq.builder()
                    .text(e.getText())
                    .build();
        }
        if (e.getCategory() != null) {
            category = e.getCategory();
        }
        return AdsSearchReqDto.builder()
                .id(String.valueOf(e.getId()))
                .filters(Filters.builder()
                        .category(category)
                        .criteria(Criteria.entityTocriteriaReq(e.getCriteria()))
                        .keywords(keywords)
                        .location(location)
                        .ranges(ranges)
                        .build())
                .order(e.getOrder())
                .sort(e.getSort())
                .limit(e.getLimit())
                .currentPage(e.getCurrentPage())
                .build();

    }

    public static List<AdsSearchReqDto> toAdsSearchReqDtoList(List<SearchEntity> searches) {
        if (Objects.isNull(searches)) {
            return Collections.emptyList();
        }
        return searches.stream().map(e -> toDto(e)).collect(Collectors.toList());
    }



}
