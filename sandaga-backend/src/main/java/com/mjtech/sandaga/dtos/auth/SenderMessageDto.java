package com.mjtech.sandaga.dtos.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.connection.FollowersDto;
import com.mjtech.sandaga.dtos.favoite.FavoritesDto;
import com.mjtech.sandaga.dtos.image.ImageDto;
import com.mjtech.sandaga.dtos.reviews.ReviewDto;
import com.mjtech.sandaga.dtos.search.AdsSearchReqDto;
import com.mjtech.sandaga.enums.message.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SenderMessageDto {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String id;

    private String firstName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String lastName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Timestamp createdAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private AddressDto address;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private ReviewDto reviews;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String image;

    private MessageType connectionStatus;
}
