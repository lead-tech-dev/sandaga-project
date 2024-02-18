package com.mjtech.sandaga.dtos.search;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Filters {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String category;

    private CriteriaReq criteria;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private KeywordsReq keywords;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private RangesReq ranges;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private LocationReq location;
}
