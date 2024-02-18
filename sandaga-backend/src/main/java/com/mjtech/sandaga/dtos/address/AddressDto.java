package com.mjtech.sandaga.dtos.address;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddressDto {

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private String id;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String number;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String street;
    private String city;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String state;
    private String country;
    private String pincode;

}
