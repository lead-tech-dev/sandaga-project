package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.ads.AdsMessageDto;
import com.mjtech.sandaga.dtos.auth.SenderMessageDto;
import com.mjtech.sandaga.dtos.categories.SubcategoryDto;
import com.mjtech.sandaga.dtos.chat.ChatResDto;
import com.mjtech.sandaga.dtos.criteria.CriteriaDto;
import com.mjtech.sandaga.dtos.message.MessageDto;
import com.mjtech.sandaga.dtos.message.MessageResDto;
import com.mjtech.sandaga.entity.ChatEntity;
import com.mjtech.sandaga.entity.MessageEntity;
import com.mjtech.sandaga.entity.UserEntity;
import com.mjtech.sandaga.enums.ads.Status;
import com.mjtech.sandaga.enums.message.MessageType;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Message {
    public static AdsMessageDto toAdsMessageDto(ChatEntity entity) {
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

        AdsMessageDto adsMessageDto = null;

        System.out.println(entity.getAds().getStatus());
        if (entity.getAds().getStatus().equals(Status.active)) {
            adsMessageDto = AdsMessageDto.builder()
                    .id(String.valueOf(entity.getAds().getId()))
                    .body(entity.getAds().getBody())
                    .subject(entity.getAds().getSubject())
                    .status(entity.getAds().getStatus())
                    .createdAt(entity.getAds().getCreatedAt())
                    .price_cents(entity.getAds().getPrice_cents())
                    .imageName(imageAds)
                    .criteria(criteriaDto)
                    .category(SubcategoryDto.builder()
                            .id(String.valueOf(entity.getAds().getCategory().getId()))
                            .name(entity.getAds().getCategory().getName())
                            .label(entity.getAds().getCategory().getLabel())
                            .channel(entity.getAds().getCategory().getChannel())
                            .build())
                    .build();
        }else if (entity.getAds().getStatus().equals(Status.delete)){
            adsMessageDto = AdsMessageDto.builder()
                    .id(String.valueOf(entity.getAds().getId()))
                    .subject(entity.getAds().getSubject())
                    .status(entity.getAds().getStatus())
                    .build();
        }
        return adsMessageDto;

    }

    public static SenderMessageDto toSenderMessageDto(UserEntity entity) {
        String userImage = null;
        AddressDto address = null;

        if (entity.getAddress() != null) {
            address = Address.toDto(entity.getAddress());
        }

        if (entity.getImage() != null) {
            userImage = entity.getImage().getName();
        }

        return SenderMessageDto.builder()
                .id(String.valueOf(entity.getId()))
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .createdAt(entity.getCreatedAt())
                .address(address)
                .reviews(Reviews.toDto(entity.getReviews()))
                .image(userImage)
                .connectionStatus(entity.getType())
                .build();

    }


    public static MessageDto toDto(MessageEntity entity) {

        return MessageDto.builder()
                .id(String.valueOf(entity.getId()))
                .message(entity.getMessage())
                .receiver(String.valueOf(entity.getReceiver().getId()))
                .owner(String.valueOf(entity.getOwner()))
                .dest(String.valueOf(entity.getDest()))
                .sender(String.valueOf(entity.getSender().getId()))
                .status(entity.getStatus())
                .type(MessageType.CHAT)
                .chatId(String.valueOf(entity.getChat().getId()))
                .createdAt(entity.getCreatedAt())
                .build();
    }


    public static List<MessageDto> toMessageResDtoList(List<MessageEntity> messages) {
        if (Objects.isNull(messages)) {
            return Collections.emptyList();
        }
        return messages.stream().map(Message::toDto).collect(Collectors.toList());
    }

}
