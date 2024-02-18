package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.CategoryEntity;
import com.mjtech.sandaga.entity.NotificationEntity;
import com.mjtech.sandaga.entity.UserEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends CrudRepository<NotificationEntity, UUID> {
    List<NotificationEntity> findNotificationEntitiesByUser(UserEntity user);
}
