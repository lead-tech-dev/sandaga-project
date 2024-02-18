package com.mjtech.sandaga.dtos.ads;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatsAdsDto {
    private int views;
    private int favorites;
    private int messages;
    private int calls;
}
