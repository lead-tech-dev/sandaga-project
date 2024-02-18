package com.mjtech.sandaga.dtos.ads;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdsPageReqDto {
    private int currentPage;
    private int limit;
}
