package com.mjtech.sandaga.dtos.auth;


import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignInReqDto {
    private String email;
    private String password;

}
