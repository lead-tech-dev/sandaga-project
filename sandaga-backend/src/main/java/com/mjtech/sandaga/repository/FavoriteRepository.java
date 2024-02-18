package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.AdsEntity;
import com.mjtech.sandaga.entity.FavoriteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FavoriteRepository extends CrudRepository<FavoriteEntity, UUID>{
    @Query(value = "SELECT * FROM sandagadb.favorites  WHERE user_id= :userId", nativeQuery = true)
    Page<FavoriteEntity> findFavoriteEntityByUserId(@Param("userId") UUID userId, Pageable pageable);

}
