package com.mjtech.sandaga.dtos.auth;

import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordUserDto {

    private String token;
    private String password;
}
