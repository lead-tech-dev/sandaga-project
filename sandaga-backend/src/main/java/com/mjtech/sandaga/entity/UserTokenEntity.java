package com.mjtech.sandaga.entity;


import lombok.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.UUID;

/**
 * @author : github.com/maximan81
 * @project : Sandaga API Development with Spring and Spring Boot
 **/
@Entity
@Table(name = "user_token", schema = "sandagadb")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTokenEntity {

    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;

    @NotNull(message = "Refresh token is required.")
    @Basic(optional = false)
    @Column(name = "refresh_token")
    private String refreshToken;

    @ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id", updatable = false)
    private UserEntity user;

}
