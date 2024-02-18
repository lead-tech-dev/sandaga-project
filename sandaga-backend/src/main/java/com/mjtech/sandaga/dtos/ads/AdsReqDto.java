package com.mjtech.sandaga.dtos.ads;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.criteria.CriteriaDto;
import com.mjtech.sandaga.dtos.point.PointDto;
import com.mjtech.sandaga.utility.dto.Criteria;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdsReqDto {
    private String ad_type;
    private String subject;
    private String body;
    private String email;
    private String phone;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private boolean donation;
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private double price_cents;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private double price_reco;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String shipping_type;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String shipping_cost;
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private boolean phone_hidden_information_text;
    private AddressDto address;
    private PointDto point;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private CriteriaDto criteria;
    private String userId;
    private String categoryId;

}
