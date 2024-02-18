package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.ImageEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ImageRepository extends CrudRepository<ImageEntity, UUID> {
    Optional<ImageEntity> findByName(String name);

    @Query(value = "SELECT * FROM sandagadb.images  WHERE name= :name", nativeQuery = true)
    Optional<ImageEntity> findImageEntityByName(@Param("name") String name);
    @Query(value = "SELECT * FROM sandagadb.images  WHERE id= :imageId", nativeQuery = true)
    Optional<ImageEntity> findImageEntityById(@Param("imageId") UUID imageId);
}
