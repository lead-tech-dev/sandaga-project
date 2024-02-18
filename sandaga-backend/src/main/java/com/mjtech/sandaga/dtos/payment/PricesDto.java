package com.mjtech.sandaga.dtos.payment;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricesDto {
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private int buyer_fees;

    private  int price;
}
