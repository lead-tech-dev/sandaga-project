package com.mjtech.sandaga.service;

import com.mjtech.sandaga.dtos.Notification.NotificationDto;
import com.mjtech.sandaga.entity.NotificationEntity;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface NotificationService {
    NotificationEntity createNotification(NotificationEntity entity);

    NotificationDto deleteNotification(UUID id);

    List<NotificationDto> getUserNotification(Principal principal);
}
