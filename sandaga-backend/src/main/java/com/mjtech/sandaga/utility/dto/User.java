package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.address.AddAddressReqDto;
import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.auth.UserDto;
import com.mjtech.sandaga.dtos.auth.UserInfoDto;
import com.mjtech.sandaga.dtos.image.ImageDto;
import com.mjtech.sandaga.entity.AddressEntity;
import com.mjtech.sandaga.entity.UserEntity;

import java.util.*;
import java.util.stream.Collectors;

public class User {

    public static UserInfoDto toUserInfoDto(UserEntity entity) {

        return UserInfoDto.builder()
                .civility(entity.getCivility())
                .hidePhone(entity.isHidePhone())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .phone(entity.getPhone())
                .build();
    }

    public static UserDto toDto(UserEntity entity) {

        ImageDto image = null;
        AddressDto address = null;

        if (entity.getAddress() != null) {
            address = Address.toDto(entity.getAddress());
        }

        if (entity.getImage() != null) {
            image= Image.toDto(entity.getImage());
        }
        return UserDto.builder()
                .id(entity.getId().toString())
                .civility(entity.getCivility())
                .hidePhone(entity.isHidePhone())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .accountType(entity.getAccountType())
                .userStatus(entity.getUserStatus())
                .createdAt(entity.getCreatedAt())
                .address(address)
                .followings(Followings.toDtoList(entity.getFollowers()))
                .followers(Followers.toDtoList(entity.getFollowings()))
                .reviews(Reviews.toDto(entity.getReviews()))
                .favorites(Favorites.toStringDtoList(entity.getFavorites()))
                .searches(Search.toAdsSearchReqDtoList(entity.getSearches()))
                .image(image)
                .stripeUserId(entity.getStripeUserId())
                .connectionStatus(String.valueOf(entity.getType()))
                .build();
    }


    public static UserEntity toEntity(UserDto userDto) {
        return UserEntity.builder()
                .id(UUID.fromString(userDto.getId()))
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .email(userDto.getEmail())
                .phone(userDto.getPhone())
                .accountType(userDto.getAccountType())
                .userStatus(userDto.getUserStatus())
                .password(userDto.getPassword())
                .build();
    }
}
