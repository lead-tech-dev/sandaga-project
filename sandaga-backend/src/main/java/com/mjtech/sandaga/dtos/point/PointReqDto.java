package com.mjtech.sandaga.dtos.point;

import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PointReqDto {

    private String id;

    private double longitude;

    private double latitude;

    private String adsId;

}
