package com.mjtech.sandaga.entity;


import lombok.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

/**
 * @author : github.com/maximan81
 * @project : Sandaga API Development with Spring and Spring Boot
 **/

@Entity
@Table(name = "category", schema = "sandagadb")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryEntity {

    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;

    @Column(name = "LABEL")
    private String label;

    @Column(name = "NAME")
    private String name;

    @Column(name = "CHANNEL")
    private String channel;

    @OneToMany(mappedBy = "categoryEntity", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<SubcategoryEntity> subcategories;



    public UUID getId() {
    return id;
}
public CategoryEntity setId(UUID id) {
    this.id = id;
    return this;
}
public String getLabel() {
    return label;
}
public CategoryEntity setLabel(String label) {
        this.label = label;
        return this;
}
public String getName() {
    return name;
}
public CategoryEntity setName(String name) {
    this.name = name;
    return this;
}
public String getChannel() {
    return channel;
}
public CategoryEntity setChannel(String channel) {
    this.channel = channel;
    return this;
}
public List<SubcategoryEntity> getSubcategories() {
    return subcategories;
}
public CategoryEntity setSubcategories(List<SubcategoryEntity> subcategories) {
    this.subcategories = subcategories;
    return this;
}}

