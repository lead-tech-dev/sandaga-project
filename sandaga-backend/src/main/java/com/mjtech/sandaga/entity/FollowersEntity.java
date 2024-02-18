package com.mjtech.sandaga.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "followers", schema = "sandagadb")
public class FollowersEntity {
    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "following_id", referencedColumnName = "ID", nullable = false)
    private UserEntity following;

    @ManyToOne
    @JoinColumn(name = "follower_id", referencedColumnName = "ID", nullable = false)
    private UserEntity follower;

    private Timestamp createdAt;

}
