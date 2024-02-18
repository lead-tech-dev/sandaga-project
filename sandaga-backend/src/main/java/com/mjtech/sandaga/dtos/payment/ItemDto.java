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
public class ItemDto {
    private String id;
    private String title;
    private String imageUrl;

    private PricesDto prices;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private int estimated_weight;
}
