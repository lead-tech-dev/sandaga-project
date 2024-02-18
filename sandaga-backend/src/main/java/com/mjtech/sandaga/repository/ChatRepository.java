package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.AdsEntity;
import com.mjtech.sandaga.entity.ChatEntity;
import com.mjtech.sandaga.entity.UserEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatRepository extends CrudRepository<ChatEntity, UUID> {
    Optional<ChatEntity> findChatEntitiesByAdsAndReceiverAndSender(AdsEntity ads, UserEntity receiver, UserEntity sender);

    List<ChatEntity> findChatEntitiesByReceiverOrSender(UserEntity receiver, UserEntity sender);
    Optional<ChatEntity> findChatEntityByReceiverAndSenderAndAds(UserEntity receiver, UserEntity sender, AdsEntity ads);
}
