package com.mjtech.sandaga.dtos.message;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mjtech.sandaga.dtos.ads.AdsMessageDto;
import com.mjtech.sandaga.dtos.auth.SenderMessageDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageResDto {
   private List<MessageDto> message;
   private AdsMessageDto ads;
    private SenderMessageDto sender;
    private String status;
}
