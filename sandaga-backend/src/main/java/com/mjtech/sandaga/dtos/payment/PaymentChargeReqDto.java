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
public class PaymentChargeReqDto {
    private String paymentId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String buyerId;

    private String selected;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String step;
}
