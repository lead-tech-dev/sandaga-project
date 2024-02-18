package com.mjtech.sandaga.dtos.search;


import com.mjtech.sandaga.dtos.ads.AdsDto;
import com.mjtech.sandaga.dtos.ads.AdsSearchDto;
import com.mjtech.sandaga.utility.dto.Ads;
import lombok.*;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdsSearchResDto {
    private int totalPages;
    private long totalItems;
    List<AdsSearchDto> ads;
}
