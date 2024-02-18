package com.mjtech.sandaga.dtos.ads;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.mjtech.sandaga.dtos.categories.SubcategoryDto;
import com.mjtech.sandaga.dtos.criteria.CriteriaDto;
import com.mjtech.sandaga.enums.ads.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdsMessageDto {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String id;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String subject;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String body;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Timestamp createdAt;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private double price_cents;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String imageName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Enumerated(EnumType.STRING)
    private Status status;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private CriteriaDto criteria;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private SubcategoryDto category;
}
