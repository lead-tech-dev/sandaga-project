package com.mjtech.sandaga.dtos.mondialrelay;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PointRelais_RechercheReqDto {
    private String enseigne;
    private String pays;
    private String ville;
    private String cp;
    private String nombreResultats;
}
