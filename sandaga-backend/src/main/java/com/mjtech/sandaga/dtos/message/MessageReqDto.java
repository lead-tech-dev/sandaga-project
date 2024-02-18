package com.mjtech.sandaga.dtos.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageReqDto {
    private String ads;
    private String sender;
    private String receiver;
    private String owner;
    private String dest;
    private String message;
}
