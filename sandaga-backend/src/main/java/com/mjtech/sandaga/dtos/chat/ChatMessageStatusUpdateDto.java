package com.mjtech.sandaga.dtos.chat;

import com.mjtech.sandaga.dtos.message.MessageDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageStatusUpdateDto {
    private String type;
    private String chatId;
    private List<MessageDto> messages;
}
