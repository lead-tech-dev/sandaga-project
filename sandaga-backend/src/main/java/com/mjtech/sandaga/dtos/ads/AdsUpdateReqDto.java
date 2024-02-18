package com.mjtech.sandaga.dtos.ads;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.criteria.CriteriaDto;
import com.mjtech.sandaga.dtos.point.PointDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdsUpdateReqDto {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String ad_type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String subject;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String body;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String email;
    @JsonInclude(JsonInclude.Include.NON_NULL)
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
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private AddressDto address;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private PointDto point;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private CriteriaDto criteria;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String userId;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String categoryId;

    public boolean getDonation() {
        return this.donation;
    }

    public  boolean getPhoneHiddenInformationText () {
        return this.phone_hidden_information_text;
    }

}
