package com.mjtech.sandaga.dtos.payment;

import com.mjtech.sandaga.dtos.address.AddressDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyerDto {
    private String id;
    private String first_name;
    private String last_name;
    private String phone_number;
    private AddressDto address;
}
