package com.mjtech.sandaga.dtos.message;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mjtech.sandaga.enums.message.MessageType;
import com.mjtech.sandaga.enums.message.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageDto {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String id;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String receiver;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String sender;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String owner;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String dest;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String message;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Status status;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private MessageType type;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String chatId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Timestamp createdAt;
}
