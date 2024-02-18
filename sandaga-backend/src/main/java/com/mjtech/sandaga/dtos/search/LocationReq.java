package com.mjtech.sandaga.dtos.search;

import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LocationReq {
    private PointReqDto point;
    private String city;
}
