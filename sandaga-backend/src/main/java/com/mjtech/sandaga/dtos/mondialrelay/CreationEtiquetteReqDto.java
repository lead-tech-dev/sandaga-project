package com.mjtech.sandaga.dtos.mondialrelay;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreationEtiquetteReqDto {
    private String enseigne;
    private String modeCol;
    private String modeLiv;
    private String expe_langage;
    private String expe_ad1;
    private String expe_ad3;
    private String expe_ville;
    private String expe_cp;
    private String expe_pays;
    private String expe_tel1;
    private String dest_langage;
    private String dest_ad1;
    private String dest_ad3;
    private String dest_ville;
    private String dest_cp;
    private String dest_pays;
    private String dest_tel1;
    private String poids;
    private String longueur;
    private String taille;
    private String nbColis;
    private String crt_valeur;
    private String crt_devise;
    private String exp_valeur;
    private String exp_devise;
    private String col_rel_pays;
    private String col_rel;
    private String liv_rel_pays;
    private String liv_rel;
    private String tAvisage;
    private String tReprise;
    private String montage;
    private String trdv;
    private String assurance;
    private String instructions;
    private String security;
    private String texte;
}
