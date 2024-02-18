package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.connection.FollowersDto;
import com.mjtech.sandaga.entity.FollowersEntity;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

public class Followers {


    public static FollowersDto toDto(FollowersEntity followersEntity) {
        return FollowersDto.builder()
                .id(String.valueOf(followersEntity.getFollower().getId()))
                .name(String.valueOf(followersEntity.getFollower().getFirstName()))
                .build();
    }



    public static List<FollowersDto> toDtoList(List<FollowersEntity> followers) {
        if (Objects.isNull(followers)) {
            return Collections.emptyList();
        }
        return followers.stream().map(e -> toDto(e)).collect(Collectors.toList());
    }
}
