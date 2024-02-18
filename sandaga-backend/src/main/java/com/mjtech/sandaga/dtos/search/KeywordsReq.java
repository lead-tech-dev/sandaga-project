package com.mjtech.sandaga.dtos.search;


import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KeywordsReq {
    private String text;
}
