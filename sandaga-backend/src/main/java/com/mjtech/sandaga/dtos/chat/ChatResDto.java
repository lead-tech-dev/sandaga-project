package com.mjtech.sandaga.dtos.chat;

import com.mjtech.sandaga.dtos.ads.AdsMessageDto;
import com.mjtech.sandaga.dtos.auth.SenderMessageDto;
import com.mjtech.sandaga.dtos.message.MessageDto;
import com.mjtech.sandaga.enums.message.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResDto {
    private String id;
    private MessageDto message;
    private AdsMessageDto ads;
    private SenderMessageDto sender;
    private MessageType type;
    private int pendingMessageNumber;
}
