package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.ReviewEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReviewRepository extends CrudRepository<ReviewEntity, UUID> {
}
