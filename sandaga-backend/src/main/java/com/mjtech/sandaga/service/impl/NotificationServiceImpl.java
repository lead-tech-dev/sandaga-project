package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.dtos.Notification.NotificationDto;
import com.mjtech.sandaga.entity.NotificationEntity;
import com.mjtech.sandaga.entity.UserEntity;
import com.mjtech.sandaga.enums.notification.NotificationStatus;
import com.mjtech.sandaga.exception.ResourceNotFoundException;
import com.mjtech.sandaga.repository.NotificationRepository;
import com.mjtech.sandaga.service.NotificationService;
import com.mjtech.sandaga.service.UserService;
import com.mjtech.sandaga.utility.dto.Notification;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public NotificationServiceImpl(NotificationRepository notificationRepository, UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    @Override
    public NotificationEntity createNotification(NotificationEntity entity) {
        return notificationRepository.save(entity);
    }

    @Override
    public NotificationDto deleteNotification(UUID id) {

        NotificationEntity notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found!"));

        notification.setStatus(NotificationStatus.read);

        notificationRepository.save(notification);

        return Notification.toDto(notification);
    }

    @Override
    public List<NotificationDto> getUserNotification(Principal principal) {
        UserEntity user = userService.findUserByEmail(principal.getName());
        List<NotificationEntity> notifications = notificationRepository.findNotificationEntitiesByUser(user);

        return Notification.toDtoList(notifications);
    }

}
