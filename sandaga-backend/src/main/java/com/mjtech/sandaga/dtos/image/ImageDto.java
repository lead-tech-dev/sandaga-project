package com.mjtech.sandaga.dtos.image;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImageDto {
    private String id;
    private String name;
    private String imageUrl;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String adsId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String userId;
}
