package com.mjtech.sandaga.dtos.chat;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExistsChatResDto {
    private boolean exists;
    private String chatId;
}
