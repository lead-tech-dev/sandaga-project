package com.mjtech.sandaga.dtos.categories;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddSubcategoryReqDto {

    private String id;
    private String label;
    private String name;
    private String channel;

    private String category_id;

}
