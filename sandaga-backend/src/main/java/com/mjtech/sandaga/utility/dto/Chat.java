package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.ads.AdsDto;
import com.mjtech.sandaga.dtos.ads.AdsMessageDto;
import com.mjtech.sandaga.dtos.auth.SenderMessageDto;
import com.mjtech.sandaga.dtos.chat.ChatResDto;
import com.mjtech.sandaga.dtos.criteria.CriteriaDto;
import com.mjtech.sandaga.dtos.image.ImageDto;
import com.mjtech.sandaga.dtos.message.MessageDto;
import com.mjtech.sandaga.dtos.message.MessageResDto;
import com.mjtech.sandaga.dtos.reviews.ReviewDto;
import com.mjtech.sandaga.dtos.search.AdsSuggestionsResDto;
import com.mjtech.sandaga.entity.AdsEntity;
import com.mjtech.sandaga.entity.ChatEntity;
import com.mjtech.sandaga.entity.MessageEntity;
import com.mjtech.sandaga.entity.UserEntity;
import com.mjtech.sandaga.enums.message.MessageType;
import com.mjtech.sandaga.enums.message.Status;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Chat {

   /* public static ChatResDto toDto(ChatEntity entity) {
        String userImage = null;
        if (entity.getSender().getImage() != null) {
            userImage = entity.getSender().getImage().getName();
        }
        String imageAds = null;
        if (entity.getAds().getImages() != null) {
            imageAds = entity.getAds().getImages().get(0).getName();
        }

        CriteriaDto criteriaDto = null;
        if (entity.getAds().getCriteria() != null) {
            criteriaDto = Criteria.toDto(entity.getAds().getCriteria());
        }
        return ChatResDto.builder()
                .id(entity.getId().toString())
                .ads(AdsMessageDto.builder()
                        .id(String.valueOf(entity.getAds().getId()))
                        .body(entity.getAds().getBody())
                        .subject(entity.getAds().getSubject())
                        .status(entity.getAds().getStatus())
                        .createdAt(entity.getAds().getCreatedAt())
                        .price_cents(entity.getAds().getPrice_cents())
                        .imageName(imageAds)
                        .criteria(criteriaDto)
                        .build())
                .sender(SenderMessageDto.builder()
                        .id(String.valueOf(entity.getId()))
                        .firstName(entity.getSender().getFirstName())
                        .lastName(entity.getSender().getLastName())
                        .createdAt(entity.getSender().getCreatedAt())
                        .address(Address.toDto(entity.getSender().getAddress()))
                        .reviews(Reviews.toDto(entity.getSender().getReviews()))
                        .image(userImage)
                        .build())
                .build();
    }
*/
    public static ChatResDto toDto(ChatEntity entity, UserEntity user) {
        String userImage = null;
        if (entity.getSender().getImage() != null) {
            userImage = entity.getSender().getImage().getName();
        }
        String imageAds = null;
        if (entity.getAds().getImages() != null) {
            imageAds = entity.getAds().getImages().get(0).getName();
        }

        CriteriaDto criteriaDto = null;
        if (entity.getAds().getCriteria() != null) {
            criteriaDto = Criteria.toDto(entity.getAds().getCriteria());
        }

        String firstname = "";
        if (user.getId() != entity.getSender().getId()) {
            firstname = entity.getSender().getFirstName();
        }else {
            firstname = entity.getReceiver().getFirstName();
        }

        int pendingMessageNumber = 0;

        MessageDto message = null;
        if (entity.getMessages() != null) {
            for (MessageEntity msg: entity.getMessages()) {

                if (msg.getDest().equals(user.getId()) && msg.getStatus().equals(Status.pending)){
                    pendingMessageNumber = pendingMessageNumber + 1;
                }
            }
            message = MessageDto.builder()
                    .message(entity.getMessages().get(0).getMessage())
                    .createdAt(entity.getMessages().get(0).getCreatedAt())
                    .build();
        }

        AdsMessageDto adsMessageDto = null;
        if (entity.getAds().getStatus().toString().equals("delete")) {
            adsMessageDto = AdsMessageDto.builder()
                    .status(entity.getAds().getStatus())
                    .subject(entity.getAds().getSubject())
                    .imageName(null)
                    .build();
        }else {
            adsMessageDto = AdsMessageDto.builder()
                    .status(entity.getAds().getStatus())
                    .subject(entity.getAds().getSubject())
                    .imageName(imageAds)
                    .build();
        }
        return ChatResDto.builder()
                .id(entity.getId().toString())
                .message(message)
                .ads(adsMessageDto)
                .sender(SenderMessageDto.builder()
                        .firstName(firstname)
                        .build())
                .pendingMessageNumber(pendingMessageNumber)
                .type(MessageType.CREATE)
                .build();
    }

    public static List<ChatResDto> toChatResDtoList(List<ChatEntity> chats, UserEntity user) {
        if (Objects.isNull(chats)) {
            return Collections.emptyList();
        }
        return chats.stream().map(chat -> Chat.toDto(chat, user)).collect(Collectors.toList());
    }
}
