package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.PointEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface PointRepository extends CrudRepository<PointEntity, UUID> {
}
