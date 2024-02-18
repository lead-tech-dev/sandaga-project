package com.mjtech.sandaga.dtos.categories;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubcategoryDto {

    private String id;
    private String label;
    private String name;
    private String channel;

    public SubcategoryDto setId(String id) {
        this.id = id;
        return this;
    }
    public SubcategoryDto setLabel(String label) {
        this.label = label;
        return this;
    }
    public SubcategoryDto setName(String name) {
        this.name = name;
        return this;
    }
    public SubcategoryDto setChannel(String channel) {
        this.channel = channel;
        return this;
    }
}
