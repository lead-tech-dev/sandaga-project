package com.mjtech.sandaga.entity;

import com.mjtech.sandaga.enums.message.MessageType;
import com.mjtech.sandaga.enums.message.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "message", schema = "sandagadb")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageEntity {
    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "receiver_id", referencedColumnName = "ID", nullable = false)
    private UserEntity receiver;

    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "ID", nullable = false)
    private UserEntity sender;

    @ManyToOne
    @JoinColumn(name = "chat_id", referencedColumnName = "ID", nullable = false)
    private ChatEntity chat;

    @Column(name = "MESSAGE")
    private String message;

    @Column(name = "OWNER")
    private UUID owner;

    @Column(name = "DEST")
    private UUID dest;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "CREATED_AT")
    private Timestamp createdAt;
}
