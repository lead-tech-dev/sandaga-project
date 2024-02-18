package com.mjtech.sandaga.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "contact", schema = "sandagadb")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactEntity {
    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;

    @Column(name = "FIRSTNAME")
    private String firstname;

    @Column(name = "LASTNAME")
    private String lastname;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "MESSAGE")
    private String message;

    @Column(name = "CONTACT_TYPE")
    private String type;

    @Column(name = "PHONE")
    private String phone;

    @Column(name = "PURCHASE_ID")
    private String purchaseId;

}
