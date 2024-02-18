package com.mjtech.sandaga.entity;

import lombok.*;
import org.hibernate.annotations.Type;

import java.util.List;
import java.util.UUID;
import javax.persistence.*;

/**
 * @author : github.com/maximan81
 * @project : Sandaga API
 **/
@Entity
@Table(name = "address", schema = "sandagadb")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressEntity {
    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;

    @Column(name = "NUMBER")
    private String number;

    @Column(name = "STREET")
    private String street;

    @Column(name = "CITY")
    private String city;

    @Column(name = "STATE")
    private String state;

    @Column(name = "COUNTRY")
    private String country;

    @Column(name = "PINCODE")
    private String pincode;


}
