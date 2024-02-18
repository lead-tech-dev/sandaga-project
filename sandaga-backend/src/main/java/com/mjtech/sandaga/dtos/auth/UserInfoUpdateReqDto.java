package com.mjtech.sandaga.dtos.auth;


import com.fasterxml.jackson.annotation.JsonInclude;import lombok.AllArgsConstructor;import lombok.Builder;import lombok.Data;import lombok.NoArgsConstructor;@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserInfoUpdateReqDto {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String civility;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String firstname;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String lastname;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String hidePhone;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String phone;
}
