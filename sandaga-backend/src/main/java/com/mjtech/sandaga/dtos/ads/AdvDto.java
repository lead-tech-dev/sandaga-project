package com.mjtech.sandaga.dtos.ads;


import com.mjtech.sandaga.dtos.auth.UserDto;
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
public class AdvDto {
    private AdsDto ads;
    private AdsSearchResDto relatedAds;
}
