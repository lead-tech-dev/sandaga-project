package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.ShippingEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface ShippingRepository extends CrudRepository<ShippingEntity, UUID> {
}
