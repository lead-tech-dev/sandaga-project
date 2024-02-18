package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.PaymentEntity;
import com.mjtech.sandaga.entity.ShippingStepEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ShippingStepRepository extends CrudRepository<ShippingStepEntity, UUID> {

    void deleteAllByPayment(PaymentEntity payment);

}
