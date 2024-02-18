package com.mjtech.sandaga.service;

import com.mjtech.sandaga.dtos.chat.ChatReqDto;
import com.mjtech.sandaga.dtos.chat.ConnectedResDto;
import com.mjtech.sandaga.dtos.message.MessageDto;
import com.mjtech.sandaga.dtos.message.MessageReqDto;
import com.mjtech.sandaga.dtos.message.MessageResDto;
import com.mjtech.sandaga.entity.MessageEntity;

import java.security.Principal;
import java.util.List;

public interface MessageService {
    void sendMessage(MessageReqDto messageReqDto);
    MessageDto addMessage(MessageReqDto messageReqDto);

    MessageResDto getChatMessage(Principal principal, String chatId);

    void disconnect(String userId);

    ConnectedResDto findConnectedUser(String userId);

    void connect(String userId);
}
