package com.mjtech.sandaga.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * @author : github.com/maximan81
 * @project : Sandaga API
 **/
@Entity
@Table(name = "shipping", schema = "sandagadb")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingEntity {
    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;

    @Column(name = "FIRSTNAME")
    private String firstname;

    @Column(name = "LASTNAME")
    private String lastname;

    @Column(name = "PHONE")
    private String phone;

    @Column(name = "ADDRESS")
    private String address;

    @Column(name = "CITY")
    private String city;

    @Column(name = "COUNTRY")
    private String country;

    @Column(name = "PINCODE")
    private String pincode;

    @OneToOne(mappedBy = "shipping")
    private PaymentEntity payment;

}
