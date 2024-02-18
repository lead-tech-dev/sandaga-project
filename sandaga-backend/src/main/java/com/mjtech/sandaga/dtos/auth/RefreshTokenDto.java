package com.mjtech.sandaga.dtos.auth;

import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RefreshTokenDto {
    private String refreshToken;
}
