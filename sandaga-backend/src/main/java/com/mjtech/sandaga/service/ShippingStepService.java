package com.mjtech.sandaga.service;

import com.mjtech.sandaga.entity.PaymentEntity;
import com.mjtech.sandaga.entity.ShippingStepEntity;

import java.util.UUID;

public interface ShippingStepService {
    ShippingStepEntity createShippingStep(ShippingStepEntity shippingStepEntity);

    ShippingStepEntity updateShippingStep(ShippingStepEntity shippingStepEntity);
    ShippingStepEntity findShippingStepById(UUID id);

    void deleteAllShippingStepByPaymentId(PaymentEntity payment);

    void deleteShippingStep(UUID id);
}
