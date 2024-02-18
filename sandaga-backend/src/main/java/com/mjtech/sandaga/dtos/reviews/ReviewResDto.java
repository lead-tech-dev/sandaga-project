package com.mjtech.sandaga.dtos.reviews;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewResDto {

    private String name;
    private int rating;
    private String review;
    private Timestamp createdAt;

}
