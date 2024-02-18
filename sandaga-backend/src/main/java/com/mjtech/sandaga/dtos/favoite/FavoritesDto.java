package com.mjtech.sandaga.dtos.favoite;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.mjtech.sandaga.dtos.ads.AdsDto;
import com.mjtech.sandaga.dtos.ads.AdsSearchDto;
import lombok.AllArgsConstructor;import lombok.Builder;import lombok.Data;import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FavoritesDto {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String id;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String adsId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String subject;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String imageUrl;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String categoryName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String categoryId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Timestamp createdAt;
}
