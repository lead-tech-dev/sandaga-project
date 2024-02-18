package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.AdsEntity;
import com.mjtech.sandaga.entity.PaymentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AdsRepository extends CrudRepository<AdsEntity, UUID> {

    Page<AdsEntity> findAll(Specification<AdsEntity> spec, Pageable pageable);

    //@Query(value = "SELECT * FROM sandagadb.ads WHERE id= :id AND user_id= :userId AND status='active'", nativeQuery = true)
    @Query(value = "SELECT * FROM sandagadb.ads WHERE id= :id AND user_id= :userId", nativeQuery = true)
    Optional<AdsEntity> findAdsEntityByIdAndUserId(@Param("id") UUID id, @Param("userId") UUID userId);

    //@Query(value = "SELECT * FROM sandagadb.ads WHERE subject LIKE %:keyword% and status='active' LIMIT 7", nativeQuery = true)
    @Query(value = "SELECT * FROM sandagadb.ads WHERE subject LIKE %:keyword% LIMIT 7", nativeQuery = true)
    List<AdsEntity> findAdsEntityByKeyword(@Param("keyword") String keyword);

    @Query(value = "SELECT * FROM sandagadb.ads WHERE status='active' ORDER BY created_at desc LIMIT 12", nativeQuery = true)
    List<AdsEntity> findAdsEntityRecent();

    @Query(value = "SELECT * FROM sandagadb.ads  WHERE user_id= :userId", nativeQuery = true)
    Page<AdsEntity> findAdsEntityByUserId(@Param("userId") UUID userId, Pageable pageable);

    /*@Query(value = "SELECT * FROM sandagadb.ads  WHERE id= :adsId", nativeQuery = true)
    Optional<AdsEntity> findById(@Param("adsId") UUID adsId);*/

   // @Query(value = "SELECT * FROM sandagadb.ads  WHERE payment_id= :paymentId AND status='active'", nativeQuery = true)
    @Query(value = "SELECT * FROM sandagadb.ads  WHERE payment_id= :paymentId", nativeQuery = true)
    Optional<AdsEntity> findAdsEntityByPayment(@Param("paymentId") UUID paymentId);

    //@Query(value = "SELECT * FROM sandagadb.ads  WHERE id= :id and status='active'", nativeQuery = true)
    @Query(value = "SELECT * FROM sandagadb.ads  WHERE id= :id", nativeQuery = true)
    Optional<AdsEntity> findActiveAdsEntityById(@Param("id") UUID id);

}
