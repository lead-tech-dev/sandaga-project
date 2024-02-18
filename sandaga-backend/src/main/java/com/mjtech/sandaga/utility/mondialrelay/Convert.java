package com.mjtech.sandaga.utility.mondialrelay;


import com.mjtech.sandaga.dtos.mondialrelay.*;

public class Convert {

    public static String toString(PointRelais_RechercheReqDto data) {
        return data.getEnseigne() + data.getPays() + data.getVille() + data.getCp() + data.getNombreResultats();
    }

    public static String toString(CreationEtiquetteReqDto data) {
        return data.getEnseigne() +
                data.getModeCol() +
                data.getModeLiv() +
                data.getExpe_langage() +
                data.getExpe_ad1() +
                data.getExpe_ad3() +
                data.getExpe_ville() +
                data.getExpe_cp() +
                data.getExpe_pays() +
                data.getExpe_tel1() +
                data.getDest_langage() +
                data.getDest_ad1() +
                data.getDest_ad3() +
                data.getDest_ville() +
                data.getDest_cp() +
                data.getDest_pays() +
                data.getDest_tel1() +
                data.getPoids() +
                data.getNbColis() +
                data.getCrt_valeur() +
                data.getCol_rel_pays() +
                data.getCol_rel() +
                data.getLiv_rel_pays() +
                data.getLiv_rel();
    }

    public static String toString(GetEtiquettesReqDto data) {
        return data.getEnseigne() + data.getExpeditions() + data.getLangue();
    }

    public static String toString(GetStatLabelReqDto data) {
        return data.getEnseigne() + data.getStatId()+ data.getLangue();
    }

    public static String toString(GetTrackingColisReqDto data) {
        return data.getEnseigne() + data.getExpeditions()+ data.getLangue();
    }
}
