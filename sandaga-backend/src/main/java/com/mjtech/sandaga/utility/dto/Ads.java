package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.ads.AdsDto;
import com.mjtech.sandaga.dtos.ads.AdsReqDto;
import com.mjtech.sandaga.dtos.ads.AdsSearchDto;
import com.mjtech.sandaga.dtos.ads.StatsAdsDto;
import com.mjtech.sandaga.dtos.auth.UserDto;
import com.mjtech.sandaga.dtos.categories.SubcategoryDto;
import com.mjtech.sandaga.dtos.criteria.CriteriaDto;
import com.mjtech.sandaga.dtos.image.ImageDto;
import com.mjtech.sandaga.dtos.point.PointDto;
import com.mjtech.sandaga.dtos.search.AdsSuggestionsResDto;
import com.mjtech.sandaga.entity.AdsEntity;
import com.mjtech.sandaga.entity.CriteriaEntity;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Ads {

    public static AdsDto toDto(AdsEntity entity) {
        List<ImageDto> images = Collections.emptyList();
        if (entity.getImages() != null) {
            images = Image.toDtoList(entity.getImages());
        }
        CriteriaDto criteriaDto = null;
        if (entity.getCriteria() != null) {
            criteriaDto = Criteria.toDto(entity.getCriteria());
        }
        return AdsDto.builder()
                .id(entity.getId().toString())
                .email(entity.getEmail())
                .subject(entity.getSubject())
                .phone(entity.getPhone())
                .body(entity.getBody())
                .createdAt(entity.getCreatedAt())
                .ad_type(entity.getAd_type())
                .donation(entity.isDonation())
                .price_cents(entity.getPrice_cents())
                .price_reco(entity.getPrice_reco())
                .phone_hidden_information_text(entity.isPhone_hidden_information_text())
                .shipping_cost(entity.getShipping_cost())
                .shipping_type(entity.getShipping_type())
                .point(Point.toDto(entity.getPoint()))
                .location(entity.getLocation())
                .address(Address.toDto(entity.getAddress()))
                .category(Subcategory.toDto(entity.getCategory()))
                .user(User.toDto(entity.getUser()))
                .images(images)
                .criteria(criteriaDto)
                .status(String.valueOf(entity.getStatus()))
                .purchaseId(entity.getPayment().getPurchaseId())
                .build();
    }

    public static AdsSearchDto toSearchDto(AdsEntity entity) {
        String imageName = null;
        if (Image.toDtoList(entity.getImages()).size() != 0) {
            imageName = Image.toDtoList(entity.getImages()).get(0).getName();
        }
        return AdsSearchDto.builder()
                .id(entity.getId().toString())
                .subject(entity.getSubject())
                .createdAt(entity.getCreatedAt())
                .price_cents(entity.getPrice_cents())
                .imageName(imageName)
                .imageCount(Image.toDtoList(entity.getImages()).size())
                .pincode(entity.getAddress().getPincode())
                .city(entity.getAddress().getCity())
                .category(entity.getCategory().getName())
                .status(entity.getStatus())
                .stats(StatsAdsDto.builder()
                        .views(entity.getViews())
                        .favorites(entity.getFavorites())
                        .messages(entity.getMessages())
                        .calls(entity.getCalls())
                        .build())
                .build();
    }

    public static List<AdsSearchDto> toSearchDtoList(List<AdsEntity> ads) {
        if (Objects.isNull(ads)) {
            return Collections.emptyList();
        }
        return ads.stream().map(e -> toSearchDto(e)).collect(Collectors.toList());
    }

    public static List<AdsDto> toDtoList(List<AdsEntity> ads) {
        if (Objects.isNull(ads)) {
            return Collections.emptyList();
        }
        return ads.stream().map(e -> toDto(e)).collect(Collectors.toList());
    }

    public static AdsEntity toEntity(AdsReqDto adsDto) {
        CriteriaEntity criteria = null;
        if (adsDto.getCriteria() != null) {
            criteria = Criteria.toEntity(adsDto.getCriteria());
        }
        return AdsEntity.builder()
                .email(adsDto.getEmail())
                .body(adsDto.getBody())
                .phone(adsDto.getPhone())
                .subject(adsDto.getSubject())
                .ad_type(adsDto.getAd_type())
                .donation(adsDto.isDonation())
                .price_cents(adsDto.getPrice_cents())
                .price_reco(adsDto.getPrice_reco())
                .shipping_type(adsDto.getShipping_type())
                .shipping_cost(adsDto.getShipping_cost())
                .phone_hidden_information_text(adsDto.isPhone_hidden_information_text())
                .criteria(criteria)
                .build();
    }



    public static AdsSuggestionsResDto toSuggestionsResDto(AdsEntity entity) {
        return AdsSuggestionsResDto.builder()
                .body(entity.getBody())
                .categoryLabel(entity.getCategory().getName())
                .categoryId(String.valueOf(entity.getCategory().getId()))
                .build();
    }

    public static List<AdsSuggestionsResDto> toAdsSuggestionsResDtoList(List<AdsEntity> ads) {
        if (Objects.isNull(ads)) {
            return Collections.emptyList();
        }
        return ads.stream().map(e -> toSuggestionsResDto(e)).collect(Collectors.toList());
    }
}
