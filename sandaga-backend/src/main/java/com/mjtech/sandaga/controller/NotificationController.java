package com.mjtech.sandaga.controller;


import com.mjtech.sandaga.dtos.Notification.NotificationDto;
import com.mjtech.sandaga.service.NotificationService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @ApiOperation(value = "Return user notification list", nickname = "getUserNotification", notes = "Return user notification list", response = NotificationDto.class, tags={ "notifications", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = NotificationDto.class) })
    @GetMapping(
            value = "/api/v1/notifications",
            produces = { "application/json" }
    )
    public ResponseEntity<List<NotificationDto>> getUserNotification(Principal principal) {
            return new ResponseEntity<>(notificationService.getUserNotification(principal), HttpStatus.OK);
    }

    @ApiOperation(value = "Return delete notification ", nickname = "deleteNotification", notes = "Return user notification list", response = NotificationDto.class, tags={ "notifications", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = NotificationDto.class) })
    @PutMapping(
            value = "/api/v1/notifications/{id}",
            produces = { "application/json" }
    )
    public ResponseEntity<NotificationDto> deleteNotification(@PathVariable String id) {
        return new ResponseEntity<>(notificationService.deleteNotification(UUID.fromString(id)), HttpStatus.OK);
    }
}


