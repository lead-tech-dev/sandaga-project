package com.mjtech.sandaga.controller;


import com.mjtech.sandaga.dtos.chat.ChatResDto;
import com.mjtech.sandaga.dtos.chat.ConnectedResDto;
import com.mjtech.sandaga.dtos.message.MessageDto;
import com.mjtech.sandaga.dtos.message.MessageReqDto;
import com.mjtech.sandaga.dtos.message.MessageResDto;
import com.mjtech.sandaga.entity.MessageEntity;
import com.mjtech.sandaga.service.MessageService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.Date;
import java.util.List;

@RestController
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @MessageMapping("/chat")
    @SendTo("/topic/public")
    public void sendMessage(@Payload MessageReqDto messageReqDto) {
        messageService.sendMessage(messageReqDto);
    }


    @MessageMapping("/chat.connect")
    @SendTo("/topic/public")
    public void connectUser(@Payload String userId) {
        messageService.connect(userId);
    }

    @MessageMapping("/chat.disconnect")
    @SendTo("/topic/public")
    public void disconnectUser(@Payload String userId) {
        messageService.disconnect(userId);
    }



    @ApiOperation(value = "Returns created message", nickname = "createChat", notes = "Returns created message", response = MessageEntity.class, responseContainer = "MessageEntity", tags={ "message", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = MessageEntity.class, responseContainer = "MessageEntity") })
    @PostMapping(
            value = "/api/v1/messages",
            produces = { "application/json" }
    )
    public ResponseEntity<MessageDto> addMessage(@ApiParam(value = ""  )  @Valid @RequestBody(required = false) MessageReqDto messageReqDto) {
        return new ResponseEntity<MessageDto>(messageService.addMessage(messageReqDto), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns chat message list", nickname = "getChatMessage", notes = "Returns chat message list", response = MessageResDto.class, responseContainer = "MessageResDto", tags={ "messages", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = MessageResDto.class, responseContainer = "MessageResDto") })
    @GetMapping(
            value = "/api/v1/messages/{chatId}",
            produces = { "application/json" }
    )
    public ResponseEntity<MessageResDto> getChatMessage(Principal principal, @PathVariable String chatId) {
        return new ResponseEntity<MessageResDto>(messageService.getChatMessage(principal, chatId), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns connected user or not", nickname = "createChat", notes = "Returns connected user or not", response = ConnectedResDto.class, responseContainer = "ConnectedResDto", tags={ "message", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = ConnectedResDto.class, responseContainer = "ConnectedResDto") })
    @GetMapping(
            value = "/api/v1/messages/connected/{userId}",
            produces = { "application/json" }
    )
    public ResponseEntity<ConnectedResDto> findConnectedUsers(@PathVariable String userId) {
        return ResponseEntity.ok(messageService.findConnectedUser(userId));
    }
}
