package com.mjtech.sandaga.dtos.search;

import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PointReqDto {
    private double lat;
    private double lng;

    private int radius;
}
