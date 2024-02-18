package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.Notification.NotificationDto;
import com.mjtech.sandaga.entity.NotificationEntity;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Notification {
    public static NotificationDto toDto(NotificationEntity e) {

        return NotificationDto.builder()
                .id(String.valueOf(e.getId()))
                .message(e.getMessage())
                .status(String.valueOf(e.getStatus()))
                .createdAt(e.getCreatedAt())
                .build();
    }

    public static List<NotificationDto> toDtoList(List<NotificationEntity> notifications) {
        if (Objects.isNull(notifications)) {
            return Collections.emptyList();
        }
        return notifications.stream().map(Notification::toDto).collect(Collectors.toList());
    }

}
