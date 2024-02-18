package com.mjtech.sandaga.dtos.payment;

import com.mjtech.sandaga.dtos.shippingStep.ShippingStepDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResDto {
    private String id;
    private ShippingStepDto shippingStep;
}
