package com.mjtech.sandaga.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mjtech.sandaga.enums.payment.PaymentStatus;
import com.mjtech.sandaga.enums.payment.ShippingStatus;
import lombok.AllArgsConstructor;import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@Entity
@Table(name = "payment", schema = "sandagadb")
public class PaymentEntity {
    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;

    private long purchaseId;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "relay_id")
    private String relayId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String delivery_mode;

    @OneToOne(mappedBy = "payment")
    private AdsEntity ads;

    @ManyToOne
    @JoinColumn(name = "buyer_id", referencedColumnName = "id")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UserEntity buyer;

    @ManyToOne
    @JoinColumn(name = "seller_id", referencedColumnName = "id")
    private UserEntity seller;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(name = "AMOUNT")
    private double amount;

    @Column(name = "CHARGE_ID")
    private String chargeId;

    private Timestamp createdAt;

    @Column(name = "LABEL_URL")
    private String labelUrl;

    @Column(name = "EXPEDITION_NUMBER")
    private String expNumber;

    @OneToOne(orphanRemoval = true)
    @JoinColumn(name = "shipping_id", referencedColumnName = "ID")
    private ShippingEntity shipping;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.REFRESH)
    private List<ShippingStepEntity> steps = Collections.emptyList();
}
