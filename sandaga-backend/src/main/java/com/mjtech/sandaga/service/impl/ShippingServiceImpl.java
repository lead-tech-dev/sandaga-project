package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.entity.ShippingEntity;
import com.mjtech.sandaga.exception.ResourceNotFoundException;
import com.mjtech.sandaga.repository.ShippingRepository;
import com.mjtech.sandaga.service.ShippingService;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class ShippingServiceImpl implements ShippingService {
    private final ShippingRepository shippingRepository;

    public ShippingServiceImpl(ShippingRepository shippingRepository) {
        this.shippingRepository = shippingRepository;
    }

    @Override
    public ShippingEntity saveShipping(ShippingEntity shippingEntity) {
        return shippingRepository.save(shippingEntity);
    }

    @Override
    public void deleteShipping(UUID id) {
        Optional<ShippingEntity> existShipping = shippingRepository.findById(id);

        if (existShipping.isEmpty()) {
            throw new ResourceNotFoundException("Not found!");
        }

        shippingRepository.deleteById(id);
    }
}
