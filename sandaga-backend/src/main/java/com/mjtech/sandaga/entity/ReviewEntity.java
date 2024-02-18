package com.mjtech.sandaga.entity;


import lombok.AllArgsConstructor;import lombok.Builder;import lombok.Data;import lombok.NoArgsConstructor;import org.hibernate.annotations.Type;import javax.persistence.*;import java.sql.Timestamp;import java.util.UUID;@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "reviews", schema = "sandagadb")
public class ReviewEntity {

    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;
    private String name;
    private int rating;
    private String review;
    private Timestamp createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "ID", nullable = false)
    private UserEntity user;
}
