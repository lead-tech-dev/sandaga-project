package com.mjtech.sandaga.dtos.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.OffsetDateTime;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SignedInUserDto {
    private String refreshToken;
    private String accessToken;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String email;
    private String role;

    private String userId;

    public SignedInUserDto setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
        return this;
    }

    public SignedInUserDto setAccessToken(String accessToken) {
    this.accessToken = accessToken;
        return this;
    }

    public SignedInUserDto setEmail(String email) {
    this.email = email;
        return this;
}}
