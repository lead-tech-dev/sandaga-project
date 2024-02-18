package com.mjtech.sandaga.service.impl;


import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.mjtech.sandaga.dtos.chat.ChatMessageStatusUpdateDto;
import com.mjtech.sandaga.dtos.chat.ChatReqDto;
import com.mjtech.sandaga.dtos.chat.ConnectedResDto;
import com.mjtech.sandaga.dtos.message.MessageDto;
import com.mjtech.sandaga.dtos.message.MessageReqDto;
import com.mjtech.sandaga.dtos.message.MessageResDto;
import com.mjtech.sandaga.entity.AdsEntity;
import com.mjtech.sandaga.entity.ChatEntity;
import com.mjtech.sandaga.entity.MessageEntity;
import com.mjtech.sandaga.entity.UserEntity;
import com.mjtech.sandaga.enums.message.MessageType;
import com.mjtech.sandaga.enums.message.Status;
import com.mjtech.sandaga.repository.MessageRepository;
import com.mjtech.sandaga.service.*;
import com.mjtech.sandaga.utility.dto.Chat;
import com.mjtech.sandaga.utility.dto.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.security.Principal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class MessageServiceImpl implements MessageService {
    private static String FRONTEND_URL = "http://localhost:3000";
    private static String BACKEND_URL = "http://localhost:8080";
    private final MessageRepository messageRepository;
    private final ChatService chatService;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    private final UserService userService;
    private LoadingCache<String, String> chatCache;
    private final EmailService emailService;

    private final AdsService adsService;

    public MessageServiceImpl(MessageRepository messageRepository, ChatService chatService, UserService userService, EmailService emailService, AdsService adsService) {
        this.messageRepository = messageRepository;
        this.chatService = chatService;
        this.userService = userService;
        this.emailService = emailService;
        this.adsService = adsService;

        this.chatCache = CacheBuilder.newBuilder().build(new CacheLoader<String,String>() {
            @Override
            public String load(String key) {
                return key.toUpperCase();
            }
        });
    }

    @Override
    public void sendMessage(MessageReqDto messageReqDto) {
        ChatEntity chat = getChat(messageReqDto);

        UserEntity dest = userService.getUserById(messageReqDto.getDest());
        String owner = userService.getUserById(messageReqDto.getOwner()).getFirstName();
        Status status = Status.pending;

        if (dest.getType().equals(MessageType.ONLINE) && dest.getCurrentChat() != null && dest.getCurrentChat().equals(String.valueOf(chat.getId()))) {
            status = Status.read;
        }
        /*List<MessageEntity> messages = messageRepository.findAllByChat(chat);

        for (MessageEntity message: messages) {
            if (message.getDest().equals(UUID.fromString(messageReqDto.getDest())) && message.getStatus().equals(Status.read)) {
                message.setStatus(Status.old);
                messageRepository.save(message);
            }
        }*/

        MessageEntity message = messageRepository.save(MessageEntity.builder()
                .chat(chat)
                .receiver(chat.getReceiver())
                .sender(chat.getSender())
                .owner(UUID.fromString(messageReqDto.getOwner()))
                .dest(UUID.fromString(messageReqDto.getDest()))
                .message(messageReqDto.getMessage())
                .createdAt(Timestamp.from(Instant.now()))
                .status(status)
                .build());

        AdsEntity ads = adsService.getAdsById(messageReqDto.getAds());

        ads.setMessages(ads.getMessages() + 1);

        adsService.saveAds(ads);

       /* if (dest.getType().toString().equals("OFFLINE")) {
            String imgName = "unnamed.png";
            if (!chat.getAds().getImages().isEmpty()) {
                imgName = chat.getAds().getImages().get(0).getName();
            }
            String chatURL = FRONTEND_URL + "/dashboard/mes-messages/" + chat.getId();
            String imageURL = BACKEND_URL + "/images/" + imgName;
            String categoryURL = FRONTEND_URL + "/recherche?category=/" + chat.getAds().getCategory().getId();
            String description = "Nouveau message pour " + chat.getAds().getSubject() +" sur sandaga";
            Context context = new Context();
            context.setVariable("receiver", dest.getFirstName());
            context.setVariable("imageURL", imageURL);
            context.setVariable("sender", owner);
            context.setVariable("category", categoryURL);
            context.setVariable("subject", chat.getAds().getSubject());
            context.setVariable("price", chat.getAds().getPrice_cents());
            context.setVariable("message", messageReqDto.getMessage());
            context.setVariable("chatURL", chatURL);

            emailService.sendEmail(dest, description, "chat-email", context);
        }
*/
        simpMessagingTemplate.convertAndSend("/topic/public", Message.toDto(message));

    }

    @Override
    public void connect(String userId) {
        UserEntity user = userService.getUserById(userId);

        user.setType(MessageType.ONLINE);

        userService.saveUser(user);

        simpMessagingTemplate.convertAndSend("/topic/public", MessageDto.builder()
                .owner(userId)
                .type(MessageType.ONLINE)
                .build()
        );
    }

    @Override
    public void disconnect(String userId) {
        UserEntity user = userService.getUserById(userId);

        user.setType(MessageType.OFFLINE);
        user.setCurrentChat(null);

        userService.saveUser(user);

        simpMessagingTemplate.convertAndSend("/topic/public", MessageDto.builder()
                .owner(userId)
                .type(MessageType.OFFLINE)
                .build()
        );
    }

    @Override
    public MessageDto addMessage(MessageReqDto messageReqDto) {
        ChatEntity chat = getChat(messageReqDto);

        MessageEntity message = messageRepository.save(MessageEntity.builder()
                .chat(chat)
                .receiver(chat.getReceiver())
                .sender(chat.getSender())
                .owner(UUID.fromString(messageReqDto.getOwner()))
                .dest(UUID.fromString(messageReqDto.getDest()))
                .message(messageReqDto.getMessage())
                .createdAt(Timestamp.from(Instant.now()))
                .status(Status.pending)
                .build());


        AdsEntity ads = adsService.getAdsById(messageReqDto.getAds());

        ads.setMessages(ads.getMessages() + 1);

        adsService.saveAds(ads);

        return Message.toDto(message);
    }

    @Override
    @Transactional
    public MessageResDto getChatMessage(Principal principal, String chatId) {
        ChatEntity chat = chatService.getChatById(chatId);
        List<MessageEntity> messages = messageRepository.findAllByChat(chat);
        UserEntity user = userService.findUserByEmail(principal.getName());
        UserEntity sender = null;
        String status = "";
        boolean update = false;
        List<MessageEntity> updateMessages = new ArrayList<>();

        for (MessageEntity message: messages) {
            if (message.getDest().equals(user.getId()) && message.getStatus().equals(Status.pending)) {
                message.setStatus(Status.read);
                messageRepository.save(message);
                update = true;
                updateMessages.add(message);
            }
        }

        if (!user.getId().equals(chat.getSender().getId())) {
            sender = chat.getSender();
        }else {
            sender = chat.getReceiver();
        }


        if (user.getId().equals(chat.getAds().getUser().getId())) {
            status = "Acheteur";
        }else {
            status = "Vendeur";
        }


        List<MessageDto> messagesDto = Message.toMessageResDtoList(messages);

        Collections.sort(messagesDto, (msg1, msg2) -> {
            return  msg1.getCreatedAt().before(msg2.getCreatedAt()) ? 1 : msg1.getCreatedAt().after(msg2.getCreatedAt()) ? -1 : 0;
        });

        if (update) {
            simpMessagingTemplate.convertAndSend("/topic/public",
                    ChatMessageStatusUpdateDto.builder()
                            .type("UPDATE")
                            .chatId(chatId)
                            .messages(Message.toMessageResDtoList(updateMessages))
                            .build());
        }

        user.setCurrentChat(chatId);
        userService.saveUser(user);

        System.out.println("Current chat " +user.getCurrentChat());

        return MessageResDto.builder()
                .message(messagesDto)
                .ads(Message.toAdsMessageDto(chat))
                .sender(Message.toSenderMessageDto(sender))
                .status(status)
                .build();
    }

    @Override
    public ConnectedResDto findConnectedUser(String userId) {
        UserEntity user = userService.getUserById(userId);

        if (user.getType().equals(MessageType.ONLINE)) {
            return ConnectedResDto.builder()
                    .connected(true)
                    .build();
        }
        return  ConnectedResDto.builder()
                .connected(false)
                .build();
    }

    private ChatEntity getChat(MessageReqDto messageReqDto) {
        return chatService.createChat(ChatReqDto.builder()
                .ads(messageReqDto.getAds())
                .receiver(messageReqDto.getReceiver())
                .sender(messageReqDto.getSender())
                .build());
    }


}
