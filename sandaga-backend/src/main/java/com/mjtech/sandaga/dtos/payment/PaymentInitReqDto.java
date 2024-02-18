package com.mjtech.sandaga.dtos.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInitReqDto {
    private String adsId;
    private int  purchaseId;
}
