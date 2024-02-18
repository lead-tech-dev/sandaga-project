package com.mjtech.sandaga.dtos.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatReqDto {
    private String ads;
    private String sender;
    private String receiver;
}
