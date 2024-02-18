package com.mjtech.sandaga.dtos.mondialrelay;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreationEtiquetteResDto {
    private String urlEtiquette;
    private String expeditionNum;
    private String stat;

}
