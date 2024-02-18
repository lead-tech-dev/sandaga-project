package com.mjtech.sandaga.dtos.point;


import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PointDto {

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private String id;

    private double longitude;

    private double latitude;


}
