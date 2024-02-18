package com.mjtech.sandaga.entity;

import com.mjtech.sandaga.dtos.search.Filters;import lombok.AllArgsConstructor;import lombok.Builder;import lombok.Data;import lombok.NoArgsConstructor;import org.hibernate.annotations.OnDelete;import org.hibernate.annotations.OnDeleteAction;import org.hibernate.annotations.Type;import javax.persistence.*;import java.util.UUID;@Entity
@Table(name = "search", schema = "sandagadb")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchEntity {
    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition="uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;
    private String category;
    private String text;
    private String location;
    private String max;
    private String min;
    @OneToOne(orphanRemoval = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "criteria_id", referencedColumnName = "ID")
    private CriteriaEntity criteria;
    private String sort;
    @Column(name = "search_order")
    private String order;
    @Column(name = "search_limit")
    private int limit;
    private  int currentPage;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "ID", nullable = false)
    private UserEntity user;

}
