package com.mjtech.sandaga.dtos.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignUpReqDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
    private int accountType;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String userStatus;
}
