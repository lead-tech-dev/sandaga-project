package com.mjtech.sandaga.dtos.Notification;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String id;

    private String message;

    private String status;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Timestamp createdAt;
}
