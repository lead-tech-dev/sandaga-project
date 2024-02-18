package com.mjtech.sandaga.entity;

import lombok.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "images", schema = "sandagadb")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageEntity {
    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "TYPE")
    private String type;
    @Column(name = "URL")
    private String url;

    @Lob
    @Type(type="org.hibernate.type.BinaryType")
    @Column(name = "image_data", columnDefinition="bytea")
    private byte[] imageData;


    @ManyToOne
    @JoinColumn(name = "ads_id", referencedColumnName = "id")
    private AdsEntity ads;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserEntity user;
}
