package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.CategoryEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface CategoryRepository extends CrudRepository<CategoryEntity, UUID> {
}
