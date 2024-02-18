package com.mjtech.sandaga.dtos.otp;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OptVerifyReqDto {
    private long otp;
    private String phone;
}
