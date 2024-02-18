package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.FavoriteEntity;
import com.mjtech.sandaga.entity.SearchEntity;
import com.mjtech.sandaga.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SearchRepository extends CrudRepository<SearchEntity, UUID> {
    List<SearchEntity> findSearchEntitiesByUser(UserEntity user);

    @Query(value = "SELECT * FROM sandagadb.search  WHERE user_id= :userId", nativeQuery = true)
    Page<SearchEntity> findSearchEntityByUserId(@Param("userId") UUID userId, Pageable pageable);

}
