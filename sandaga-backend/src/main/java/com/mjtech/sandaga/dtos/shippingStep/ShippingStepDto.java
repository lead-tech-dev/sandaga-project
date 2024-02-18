package com.mjtech.sandaga.dtos.shippingStep;

import com.mjtech.sandaga.enums.payment.ShippingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingStepDto {
    private String step;
    private String selected;
    private ShippingStatus status;
    private Timestamp expireDate;
}
