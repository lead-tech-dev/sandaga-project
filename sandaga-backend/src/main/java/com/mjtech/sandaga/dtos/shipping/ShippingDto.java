package com.mjtech.sandaga.dtos.shipping;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingDto {

    private String street;

    private String city;

    private String pincode;
}
