package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.payment.PaymentDto;
import com.mjtech.sandaga.dtos.shippingStep.ShippingStepDto;
import com.mjtech.sandaga.entity.PaymentEntity;
import com.mjtech.sandaga.entity.ShippingStepEntity;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class ShippingStep {

    public static ShippingStepDto toDto(ShippingStepEntity entity) {
        return ShippingStepDto.builder()
                .step(String.valueOf(entity.getStep()))
                .status(entity.getStatus())
                .selected(entity.getSelected())
                .expireDate(entity.getExpiryDate())
                .build();
    }

    public static List<ShippingStepDto> toDtoList(List<ShippingStepEntity> shippingSteps) {
        if (Objects.isNull(shippingSteps)) {
            return Collections.emptyList();
        }
        return shippingSteps.stream().map(ShippingStep::toDto).collect(Collectors.toList());
    }
}
