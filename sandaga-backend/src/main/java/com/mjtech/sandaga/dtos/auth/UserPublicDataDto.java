package com.mjtech.sandaga.dtos.auth;

import com.mjtech.sandaga.dtos.ads.AdsSearchDto;
import com.mjtech.sandaga.dtos.search.AdsSearchResDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserPublicDataDto {

    private UserDto user;

    private AdsSearchResDto relatedAds;
}
