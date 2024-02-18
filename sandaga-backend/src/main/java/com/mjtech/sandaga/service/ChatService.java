package com.mjtech.sandaga.service;

import com.mjtech.sandaga.dtos.chat.*;
import com.mjtech.sandaga.entity.ChatEntity;
import com.mjtech.sandaga.entity.EmptyEntity;

import java.security.Principal;
import java.util.List;

public interface ChatService {
    ChatEntity createChat(ChatReqDto chatReqDto);

    List<ChatResDto> getUserChats(Principal principal);

    ChatEntity getChatById(String chatId);

    EmptyEntity deleteChats(Principal principal, String id);

    ExistsChatResDto getExistsChat(ExistsChatReqDto existsChatReqDto);
}
