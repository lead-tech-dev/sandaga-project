package com.mjtech.sandaga.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "chat", schema = "sandagadb")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatEntity {
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
    @JoinColumn(name = "ads_id", referencedColumnName = "ID", nullable = false)
    private AdsEntity ads;

    @OneToMany(mappedBy = "chat", orphanRemoval = true, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<MessageEntity> messages;

    @Column(name = "CREATED_AT")
    private Timestamp createdAt;
}
