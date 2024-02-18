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
public class PaymentReqDto {
    private String token;

    private String buyerId;

    private String amount;

    private String deliveryMode;

    private String purchaseId;

    private String subject;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String relayId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private ShippingAddress shippingAddress;

}
