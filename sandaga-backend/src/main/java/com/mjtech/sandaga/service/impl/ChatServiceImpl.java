package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.dtos.chat.*;
import com.mjtech.sandaga.entity.*;
import com.mjtech.sandaga.enums.message.Status;
import com.mjtech.sandaga.exception.ResourceNotFoundException;
import com.mjtech.sandaga.repository.ChatRepository;
import com.mjtech.sandaga.service.AdsService;
import com.mjtech.sandaga.service.ChatService;
import com.mjtech.sandaga.service.UserService;
import com.mjtech.sandaga.utility.dto.Chat;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@Service
public class ChatServiceImpl implements ChatService {
    private final ChatRepository chatRepository;
    private final AdsService adsService;
    private final UserService userService;

    public ChatServiceImpl(ChatRepository chatRepository, AdsService adsService, UserService userService) {
        this.chatRepository = chatRepository;
        this.adsService = adsService;
        this.userService = userService;
    }

    @Override
    public ChatEntity createChat(ChatReqDto chatReqDto) {
        AdsEntity ads = adsService.getAdsById(chatReqDto.getAds());
        UserEntity receiver = userService.getUserById(chatReqDto.getReceiver());
        UserEntity sender = userService.getUserById(chatReqDto.getSender());

        Optional<ChatEntity> chat = chatRepository.findChatEntitiesByAdsAndReceiverAndSender(ads, receiver, sender);

        return chat.orElseGet(() -> chatRepository.save(ChatEntity.builder()
                .ads(ads)
                .receiver(receiver)
                .sender(sender)
                .createdAt(Timestamp.from(Instant.now()))
                .build()));
    }

    @Override
    public List<ChatResDto> getUserChats(Principal principal) {
        UserEntity user = userService.findUserByEmail(principal.getName());
        List<ChatEntity> chats = chatRepository.findChatEntitiesByReceiverOrSender(user, user);

        List<ChatResDto> res = Chat.toChatResDtoList(chats, user);

        Collections.sort(res, (chat1, chat2) -> {
            return  chat1.getMessage().getCreatedAt().before(chat2.getMessage().getCreatedAt()) ? 1 : chat1.getMessage().getCreatedAt().after(chat2.getMessage().getCreatedAt()) ? -1 : 0;

        });
        return res;
    }

    @Override
    public ChatEntity getChatById(String chatId) {
         Optional<ChatEntity> chat = chatRepository.findById(UUID.fromString(chatId));
         if (chat.isEmpty()) {
             throw new ResourceNotFoundException("Chat not found!");
         }

        return chat.get();
    }

    @Override
    public EmptyEntity deleteChats(Principal principal, String id) {
        Optional<ChatEntity> chat = chatRepository.findById(UUID.fromString(id));

        if (chat.isEmpty()) {
            throw new ResourceNotFoundException("Chat not found");
        }

        chatRepository.deleteById(chat.get().getId());

        return new EmptyEntity();
    }

    @Override
    public ExistsChatResDto getExistsChat(ExistsChatReqDto existsChatReqDto) {
        UserEntity receiver = userService.getUserById(existsChatReqDto.getReceiver());
        UserEntity sender = userService.getUserById(existsChatReqDto.getSender());
        AdsEntity ads = adsService.getAdsById(existsChatReqDto.getAds());

        Optional<ChatEntity> chat = chatRepository.findChatEntityByReceiverAndSenderAndAds(receiver, sender, ads);
        boolean exists = false;
        String chatId = null;

        if (chat.isPresent()) {
            exists = true;
            chatId = String.valueOf(chat.get().getId());
        }

        return ExistsChatResDto.builder()
                .exists(exists)
                .chatId(chatId)
                .build();
    }
}
