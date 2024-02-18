package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.PasswordResetTokenEntity;
import com.mjtech.sandaga.entity.UserEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

public interface PasswordResetTokenRepository extends CrudRepository<PasswordResetTokenEntity, UUID> {
    Optional<PasswordResetTokenEntity> findByToken(String token);

    PasswordResetTokenEntity findByUser(UserEntity user);

    Stream<PasswordResetTokenEntity> findAllByExpiryDateLessThan(Date now);

    @Modifying
    @Query(value = "delete from password_reset_token t where t.expiryDate <= ?1", nativeQuery = true)
    void deleteAllExpiredSince(Date now);
}
