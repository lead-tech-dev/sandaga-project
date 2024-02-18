package com.mjtech.sandaga.dtos.mondialrelay;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetEtiquettesReqDto {
    private String enseigne;
    private String expeditions;
    private String  langue;
}
