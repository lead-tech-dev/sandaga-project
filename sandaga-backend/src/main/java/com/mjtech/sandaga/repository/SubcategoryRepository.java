package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.CategoryEntity;
import com.mjtech.sandaga.entity.SubcategoryEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface SubcategoryRepository extends CrudRepository<SubcategoryEntity, UUID> {
}
