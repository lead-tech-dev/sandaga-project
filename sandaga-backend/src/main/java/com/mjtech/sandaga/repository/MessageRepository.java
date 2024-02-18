package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.ChatEntity;
import com.mjtech.sandaga.entity.MessageEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MessageRepository extends CrudRepository<MessageEntity, UUID> {
    List<MessageEntity> findAllByChat(ChatEntity chat);

    @Query(value = "SELECT * FROM sandagadb.message m ORDER BY m.created_at DESC LIMIT 1", nativeQuery = true)
    Optional<MessageEntity> getLastMessage();
}
