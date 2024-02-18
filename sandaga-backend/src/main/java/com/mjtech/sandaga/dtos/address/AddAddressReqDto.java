package com.mjtech.sandaga.dtos.address;

import lombok.AllArgsConstructor;import lombok.Builder;import lombok.Data;import lombok.NoArgsConstructor;@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddAddressReqDto {
    private String number;
    private String street;
    private String city;
    private String state;
    private String country;
    private String pincode;

}
