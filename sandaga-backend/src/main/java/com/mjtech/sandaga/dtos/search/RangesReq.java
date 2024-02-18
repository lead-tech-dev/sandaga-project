package com.mjtech.sandaga.dtos.search;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RangesReq {
    private PriceReq price;
}
