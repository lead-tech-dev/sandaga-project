package com.mjtech.sandaga.entity;


import com.mjtech.sandaga.enums.payment.ShippingStatus;
import com.mjtech.sandaga.enums.payment.ShippingStep;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "shipping_step", schema = "sandagadb")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingStepEntity {
    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;

    private String step;

    private String selected;

    @Enumerated(EnumType.STRING)
    private ShippingStatus status;

    @Column(name = "EXPIRY_DATE")
    private Timestamp expiryDate;

    @ManyToOne
    @JoinColumn(name = "payment_id", referencedColumnName = "ID", nullable = false)
    private PaymentEntity payment;

}
