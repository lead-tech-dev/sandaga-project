package com.mjtech.sandaga.service;

import com.mjtech.sandaga.entity.ShippingEntity;

import java.util.UUID;

public interface ShippingService {

    ShippingEntity saveShipping(ShippingEntity shippingEntity);
    void deleteShipping(UUID id);
}
