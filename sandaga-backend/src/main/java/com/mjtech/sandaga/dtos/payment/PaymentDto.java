package com.mjtech.sandaga.dtos.payment;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mjtech.sandaga.dtos.shipping.ShippingDto;
import com.mjtech.sandaga.dtos.shippingStep.ShippingStepDto;
import com.mjtech.sandaga.entity.ShippingEntity;
import com.mjtech.sandaga.entity.ShippingStepEntity;
import com.mjtech.sandaga.enums.payment.PaymentStatus;
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
public class PaymentDto {
    private String id;

    private String purchaseId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String paymentId;

    private String delivery_mode;

    private ItemDto ads;

    private double amount;

    private Timestamp createdAt;

    private PaymentStatus status;

    private SellerDto seller;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BuyerDto buyer;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String labelUrl;

    private List<ShippingStepDto> shippingStep;

    private ShippingDto shippingAddress;
}
