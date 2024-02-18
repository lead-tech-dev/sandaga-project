package com.mjtech.sandaga.entity;
import com.bedatadriven.jackson.datatype.jts.serialization.GeometryDeserializer;
import com.bedatadriven.jackson.datatype.jts.serialization.GeometrySerializer;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.mjtech.sandaga.enums.ads.Status;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.Type;
import org.locationtech.jts.geom.Point;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "ads", schema = "sandagadb")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdsEntity {

    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;

    private String ad_type;

    private String subject;

    private String body;

    private String email;

    private String phone;

    private Timestamp createdAt;

    @Enumerated(EnumType.STRING)
    private Status status;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private boolean donation;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private double price_cents;


    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private double price_reco;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String shipping_type;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String shipping_cost;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private boolean phone_hidden_information_text;



    @OneToOne(orphanRemoval = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "criteria_id", referencedColumnName = "ID")
    private CriteriaEntity criteria;

    @OneToOne(orphanRemoval = true, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "address_id", referencedColumnName = "ID", nullable = false)
    private AddressEntity address;

    @OneToOne(orphanRemoval = true)
    @JoinColumn(name = "point_id", referencedColumnName = "ID", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private PointEntity point;

    @Column(name = "point", columnDefinition = "geometry(Point,4326)", nullable = false)
    @JsonSerialize(using = GeometrySerializer.class)
    @JsonDeserialize(contentUsing = GeometryDeserializer.class)
    private Point location;

    @OneToMany(mappedBy = "ads", orphanRemoval = true, fetch = FetchType.EAGER, cascade = CascadeType.REFRESH)
    private List<ImageEntity> images;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "ID", nullable = false)
    private UserEntity user;


    @ManyToOne
    @JoinColumn(name = "subcategory_id", referencedColumnName = "ID", nullable = false)
    private SubcategoryEntity category;

    @OneToOne
    @JoinColumn(name = "payment_id", referencedColumnName = "id")
    private PaymentEntity payment;

    @OneToMany(mappedBy = "ads", orphanRemoval = true, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ChatEntity> chats;

    @Column(name = "NBR_VIEWS")
    private int views;

    @Column(name = "NBR_FAVORITES")
    private int favorites;

    @Column(name = "NBR_MESSAGES")
    private int messages;

    @Column(name = "NBR_CALLS")
    private int calls;
}
