package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.chat.*;
import com.mjtech.sandaga.entity.ChatEntity;
import com.mjtech.sandaga.entity.EmptyEntity;
import com.mjtech.sandaga.entity.MessageEntity;
import com.mjtech.sandaga.service.ChatService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @ApiOperation(value = "Returns created chat", nickname = "createChat", notes = "Returns created chat", response = ChatEntity.class, responseContainer = "ChatEntity", tags={ "chat", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = ChatEntity.class, responseContainer = "ChatEntity") })
    @PostMapping(
            value = "/api/v1/chats",
            produces = { "application/json" }
    )
    public ResponseEntity<ChatEntity> createChat(@ApiParam(value = ""  )  @Valid @RequestBody(required = false) ChatReqDto chatReqDto) {
        return new ResponseEntity<ChatEntity>(chatService.createChat(chatReqDto), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns user chat list", nickname = "getUserChats", notes = "Returns user chat list", response = ChatResDto.class, responseContainer = "ChatResDto", tags={ "chat", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = ChatResDto.class, responseContainer = "ChatResDto") })
    @GetMapping(
            value = "/api/v1/chats",
            produces = { "application/json" }
    )
    public ResponseEntity<List<ChatResDto>> getUserChats(Principal principal) {
        return new ResponseEntity<List<ChatResDto>>(chatService.getUserChats(principal), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns if exists chat between two user", nickname = "getExistsChat", notes = "Returns if exists chat between two user", response = Boolean.class, responseContainer = "Boolean", tags={ "chat", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = Boolean.class, responseContainer = "Boolean") })
    @PostMapping(
            value = "/api/v1/chats/exists",
            produces = { "application/json" }
    )
    public ResponseEntity<ExistsChatResDto> getExistsChat(@RequestBody ExistsChatReqDto existsChatReqDto) {
        return new ResponseEntity<>(chatService.getExistsChat(existsChatReqDto), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns emptyEntity", nickname = "getUserChats", notes = "Returns emptyEntity", response = EmptyEntity.class, responseContainer = "EmptyEntity", tags={ "chat", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
    @DeleteMapping(
            value = "/api/v1/chats/{id}",
            produces = { "application/json" }
    )
    public ResponseEntity<EmptyEntity> deleteChats(Principal principal, @PathVariable String id) {
        return new ResponseEntity<EmptyEntity>(chatService.deleteChats(principal, id), HttpStatus.OK);

    }


}
