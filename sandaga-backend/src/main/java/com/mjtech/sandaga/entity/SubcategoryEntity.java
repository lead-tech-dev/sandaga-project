package com.mjtech.sandaga.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "subcategory", schema = "sandagadb")
@JsonIgnoreProperties({"ads"})
public class SubcategoryEntity {

    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition="uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;


    @Column(name = "LABEL")
    private String label;

    @Column(name = "NAME")
    private String name;

    @Column(name = "CHANNEL")
    private String channel;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "CATEGORY_ID", referencedColumnName = "ID")
    private CategoryEntity categoryEntity;


    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<AdsEntity> ads = Collections.emptyList();

    public UUID getId() {
    return id;
   }
   public SubcategoryEntity setId(UUID id) {
    this.id = id;
    return this;
   }
public String getLabel() {
    return label;
}
public SubcategoryEntity setLabel(String label) {
    this.label = label;
    return this;
}
public String getName() {
    return name;
}
public SubcategoryEntity setName(String name) {
    this.name = name;
    return this;
}
public String getChannel() {
    return channel;
}
public SubcategoryEntity setChannel(String channel) {
    this.channel = channel;
    return this;
}
public CategoryEntity getCategoryEntity() {
    return categoryEntity;
}
public SubcategoryEntity setCategoryEntity(CategoryEntity categoryEntity) {
    this.categoryEntity = categoryEntity;
    return this;
}
}
