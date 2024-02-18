package com.mjtech.sandaga.dtos.reviews;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewReqDto {
    private String userSenderName;
    private int rating;
    private String review;

    private String userReceiverId;
}
