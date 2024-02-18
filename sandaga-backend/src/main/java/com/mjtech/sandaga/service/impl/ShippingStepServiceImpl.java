package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.entity.PaymentEntity;
import com.mjtech.sandaga.entity.ShippingStepEntity;
import com.mjtech.sandaga.exception.ResourceNotFoundException;
import com.mjtech.sandaga.repository.ShippingStepRepository;
import com.mjtech.sandaga.service.ShippingStepService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
public class ShippingStepServiceImpl implements ShippingStepService {

    private final ShippingStepRepository shippingStepRepository;

    public ShippingStepServiceImpl(ShippingStepRepository shippingStepRepository) {
        this.shippingStepRepository = shippingStepRepository;
    }

    @Override
    public ShippingStepEntity createShippingStep(ShippingStepEntity shippingStepEntity) {
        return shippingStepRepository.save(shippingStepEntity);
    }

    @Override
    public ShippingStepEntity findShippingStepById(UUID id) {
        Optional<ShippingStepEntity> shippingStep = shippingStepRepository.findById(id);

        if (shippingStep.isEmpty()) {
            throw new ResourceNotFoundException("Not found");
        }

        return shippingStep.get();
    }

    @Override
    public void deleteAllShippingStepByPaymentId(PaymentEntity payment) {
        payment.getSteps().forEach(step -> {
               shippingStepRepository.deleteById(step.getId());
        });

    }

    @Override
    public ShippingStepEntity updateShippingStep(ShippingStepEntity shippingStepEntity) {
        return shippingStepRepository.save(shippingStepEntity);
    }

    @Override
    public void deleteShippingStep(UUID id) {
        Optional<ShippingStepEntity> step = shippingStepRepository.findById(id);

        if (step.isEmpty()) {
            throw new ResourceNotFoundException("Not found!");
        }

        shippingStepRepository.deleteById(step.get().getId());
    }
}
