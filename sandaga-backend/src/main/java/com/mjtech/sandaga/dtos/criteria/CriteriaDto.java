package com.mjtech.sandaga.dtos.criteria;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CriteriaDto {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String id;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String item_condition;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String video_game_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String console_model;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String console_brand;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String image_sound_type_of_product;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String image_sound_product;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String phone_brand;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String phone_color;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String phone_model;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String phone_memory;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String furniture_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String furniture_material;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String furniture_color;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String home_appliance_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String home_appliance_product;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String home_appliance_brand;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String table_art_product;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String table_art_material;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String decoration_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String linens_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String  linens_product;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String linens_material;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String diy_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String diy_product;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String gardening_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String gardening_product;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String clothing_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String clothing_st;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String clothing_category;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String clothing_brand;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String clothing_color;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String clothing_condition;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String shoe_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String shoe_category;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String shoe_size;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String shoe_brand;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String accessories_univers;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String accessories_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String accessories_brand;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String accessories_material;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String watches_jewels_brand;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String watches_jewels_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String watches_jewels_material;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String baby_equipment_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String baby_equipment_brand;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String baby_clothing_category;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String baby_clothing_brand;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String baby_age;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String bicycle_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String bicycle_size;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String bicycode;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String sports_hobbies_activity;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String toy_age;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String toy_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String matpro_agriculture_equipment_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String matpro_transport_handling_equipment_type;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String matpro_btp_equipment_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String regdate;
}
