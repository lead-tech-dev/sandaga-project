package com.mjtech.sandaga.entity;

import com.mjtech.sandaga.enums.message.Status;
import com.mjtech.sandaga.enums.notification.NotificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "notification", schema = "sandagadb")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEntity {
    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "ID", nullable = false)
    private UserEntity user;

    @Column(name = "MESSAGE")
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationStatus status;

    @Column(name = "CREATED_AT")
    private Timestamp createdAt;
}
