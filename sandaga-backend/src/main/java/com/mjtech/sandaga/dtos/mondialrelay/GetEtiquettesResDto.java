package com.mjtech.sandaga.dtos.mondialrelay;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetEtiquettesResDto {
    private String urlPDFA4;
    private String  stat;
}
