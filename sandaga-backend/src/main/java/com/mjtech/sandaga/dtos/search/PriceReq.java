package com.mjtech.sandaga.dtos.search;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PriceReq {

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private double min;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private double max;
}
