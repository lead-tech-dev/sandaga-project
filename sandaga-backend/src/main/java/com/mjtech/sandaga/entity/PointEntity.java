package com.mjtech.sandaga.entity;


import lombok.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "point", schema = "sandagadb")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointEntity {

    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;

    @Column(name = "LONGITUDE")
    private double longitude;

    @Column(name = "LATITUDE")
    private double latitude;

    @OneToOne(mappedBy = "point", cascade = CascadeType.ALL)
    private AdsEntity ads;
}
