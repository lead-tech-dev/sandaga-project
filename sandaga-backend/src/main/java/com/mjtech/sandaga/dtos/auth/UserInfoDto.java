package com.mjtech.sandaga.dtos.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserInfoDto {
    private String civility;
    private String firstName;
    private String lastName;
    private boolean hidePhone;
    private String phone;
}
