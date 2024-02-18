package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.CriteriaEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface CriteriaRepository extends CrudRepository<CriteriaEntity, UUID> {
}
