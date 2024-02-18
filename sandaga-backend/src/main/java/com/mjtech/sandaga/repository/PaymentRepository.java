package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.AdsEntity;
import com.mjtech.sandaga.entity.PaymentEntity;
import com.mjtech.sandaga.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends CrudRepository<PaymentEntity, UUID> {
    Optional<PaymentEntity> findPaymentEntityByPurchaseId(long purchaseId);

    @Query(value = "SELECT * FROM sandagadb.payment  WHERE buyer_id= :buyerId OR seller_id= :sellerId AND status <> 'init'", nativeQuery = true)
    Page<PaymentEntity> findPaymentEntityByBuyerIdOrSellerId(@Param("buyerId") UUID buyerId, @Param("sellerId") UUID sellerId, Pageable pageable);

    //List<PaymentEntity> findPaymentEntityByBuyerOrSellerAndStatusNotNull(UserEntity buyer, UserEntity seller);
}
