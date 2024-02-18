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
public class FaceToFaceDto {
    private String city;
    private String zipcode;
}
