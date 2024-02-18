package com.mjtech.sandaga.dtos.search;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdsSearchReqDto {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String id;
    private Filters filters;
    private String sort;
    private String order;
    private int limit;
    private  int currentPage;

}
