package com.mjtech.sandaga.dtos.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.connection.FollowersDto;
import com.mjtech.sandaga.dtos.favoite.FavoritesDto;
import com.mjtech.sandaga.dtos.image.ImageDto;
import com.mjtech.sandaga.dtos.reviews.ReviewDto;
import com.mjtech.sandaga.dtos.search.AdsSearchReqDto;
import lombok.*;

import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private String id;
    private String civility;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String username;
    private String firstName;
    private String lastName;
    private boolean hidePhone;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String password;
    private String email;
    private String phone;
    private String userStatus;
    private Integer accountType;
    private Timestamp createdAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private AddressDto address;
    private List<FollowersDto> followings;

    private List<FollowersDto> followers;

    private List<FavoritesDto> favorites;

    private List<AdsSearchReqDto> searches;

    private ReviewDto reviews;

    private ImageDto image;

    private int chatsMessagePendingNumber;

    private String stripeUserId;
    private String connectionStatus;
}
