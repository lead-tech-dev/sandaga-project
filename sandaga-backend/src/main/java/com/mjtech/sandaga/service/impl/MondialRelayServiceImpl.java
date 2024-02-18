package com.mjtech.sandaga.service.impl;


import com.mjtech.sandaga.dtos.mondialrelay.*;
import com.mjtech.sandaga.service.MondialRelayService;
import com.mjtech.sandaga.utility.Utility;
import com.mjtech.sandaga.utility.mondialrelay.Convert;
import com.mjtech.sandaga.webservice.MondialRelayClient;
import fr.mondialrelay.webservice.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MondialRelayServiceImpl implements MondialRelayService {
    private final MondialRelayClient quoteClient;
    public MondialRelayServiceImpl(MondialRelayClient quoteClient) {
        this.quoteClient = quoteClient;
    }
    @Override
    public List<PointRelaisDetails> WSI4_PointRelais_RechercheSoapIn(PointRelais_RechercheReqDto pointRelaisRechercheReqDto) {
        String security = Utility.toMd5(Convert.toString(pointRelaisRechercheReqDto) + "PrivateK");
        WSI4PointRelaisRecherche parameters = new WSI4PointRelaisRecherche();

        parameters.setEnseigne(pointRelaisRechercheReqDto.getEnseigne());
        parameters.setPays(pointRelaisRechercheReqDto.getPays());
        parameters.setVille(pointRelaisRechercheReqDto.getVille());
        parameters.setCP(pointRelaisRechercheReqDto.getCp());
        parameters.setNombreResultats(Integer.parseInt(pointRelaisRechercheReqDto.getNombreResultats()));
        parameters.setSecurity(security);

        WSI4PointRelaisRechercheResponse response = quoteClient.WSI4_PointRelais_RechercheSoapIn(parameters);

        return response.getWSI4PointRelaisRechercheResult().getPointsRelais().getPointRelaisDetails();
    }

    @Override
    public CreationEtiquetteResDto WSI2_CreationEtiquetteSoapIn(CreationEtiquetteReqDto creationEtiquetteReqDto) {

        String security = Utility.toMd5(Convert.toString(creationEtiquetteReqDto) + "PrivateK");

        WSI2CreationEtiquette parameters = new WSI2CreationEtiquette();

        parameters.setEnseigne(creationEtiquetteReqDto.getEnseigne());
        parameters.setModeCol(creationEtiquetteReqDto.getModeCol());
        parameters.setModeLiv(creationEtiquetteReqDto.getModeLiv());

        parameters.setExpeLangage(creationEtiquetteReqDto.getExpe_langage());
        parameters.setExpeAd1(creationEtiquetteReqDto.getExpe_ad1());
        parameters.setExpeAd3(creationEtiquetteReqDto.getExpe_ad3());
        parameters.setExpeVille(creationEtiquetteReqDto.getExpe_ville());
        parameters.setExpeCP(creationEtiquetteReqDto.getExpe_cp());
        parameters.setExpePays(creationEtiquetteReqDto.getExpe_pays());
        parameters.setExpeTel1(creationEtiquetteReqDto.getExpe_tel1());

        parameters.setDestLangage(creationEtiquetteReqDto.getDest_langage());
        parameters.setDestAd1(creationEtiquetteReqDto.getDest_ad1());
        parameters.setDestAd3(creationEtiquetteReqDto.getDest_ad3());
        parameters.setDestVille(creationEtiquetteReqDto.getDest_ville());
        parameters.setDestCP(creationEtiquetteReqDto.getDest_cp());
        parameters.setDestPays(creationEtiquetteReqDto.getDest_pays());
        parameters.setDestTel1(creationEtiquetteReqDto.getDest_tel1());

        parameters.setPoids(creationEtiquetteReqDto.getPoids());
        parameters.setNbColis(creationEtiquetteReqDto.getNbColis());
        parameters.setCRTValeur(creationEtiquetteReqDto.getCrt_valeur());
        parameters.setCOLRelPays(creationEtiquetteReqDto.getCol_rel_pays());
        parameters.setCOLRel(creationEtiquetteReqDto.getCol_rel());
        parameters.setLIVRelPays(creationEtiquetteReqDto.getLiv_rel_pays());
        parameters.setLIVRel(creationEtiquetteReqDto.getLiv_rel());
        parameters.setSecurity(security);
        parameters.setTexte(creationEtiquetteReqDto.getTexte());

        creationEtiquetteReqDto.setSecurity(security);

        WSI2CreationEtiquetteResponse response = quoteClient.WSI2_CreationEtiquetteSoapIn(parameters);

         return CreationEtiquetteResDto.builder()
                 .urlEtiquette("https://www.mondialrelay.fr/" +response.getWSI2CreationEtiquetteResult().getURLEtiquette())
                 .expeditionNum(response.getWSI2CreationEtiquetteResult().getExpeditionNum())
                 .stat(response.getWSI2CreationEtiquetteResult().getSTAT())
                 .build();
    }

    @Override
    public GetEtiquettesResDto WSI3_GetEtiquetteSoapIn(GetEtiquettesReqDto getEtiquettesReqDto) {
        String security = Utility.toMd5(Convert.toString(getEtiquettesReqDto) + "PrivateK");

        WSI3GetEtiquettes parameters = new WSI3GetEtiquettes();

        parameters.setEnseigne(getEtiquettesReqDto.getEnseigne());
        parameters.setExpeditions(getEtiquettesReqDto.getExpeditions());
        parameters.setLangue(getEtiquettesReqDto.getLangue());

        parameters.setSecurity(security);

        WSI3GetEtiquettesResponse response = quoteClient.WSI3_GetEtiquettesSoapIn(parameters);


        return GetEtiquettesResDto.builder()
                .urlPDFA4("https://www.mondialrelay.fr/" +response.getWSI3GetEtiquettesResult().getURLPDFA4())
                .stat(response.getWSI3GetEtiquettesResult().getSTAT())
                .build();
    }

    @Override
    public GetStatLabelResDto WSI2_GetStatLabelSoapIn(GetStatLabelReqDto getStatLabelReqDto) {
        String security = Utility.toMd5(Convert.toString(getStatLabelReqDto) + "PrivateK");

        WSI2STATLabel parameters = new WSI2STATLabel();

        parameters.setEnseigne(getStatLabelReqDto.getEnseigne());
        parameters.setSTATID(getStatLabelReqDto.getStatId());
        parameters.setLangue(getStatLabelReqDto.getLangue());
        parameters.setSecurity(security);

        WSI2STATLabelResponse response = quoteClient.WSI2_STAT_LabelSoapIn(parameters);

        return GetStatLabelResDto.builder()
                .stat(response.getWSI2STATLabelResult())
                .build();
    }

    @Override
    public WSI2TracingColisDetailleResponse WSI2_TracingColisDetailleIn(GetTrackingColisReqDto getTrackingColisReqDto) {
        String security = Utility.toMd5(Convert.toString(getTrackingColisReqDto) + "PrivateK");

        WSI2TracingColisDetaille parameters = new WSI2TracingColisDetaille();

        parameters.setEnseigne(getTrackingColisReqDto.getEnseigne());
        parameters.setExpedition(getTrackingColisReqDto.getExpeditions());
        parameters.setLangue(getTrackingColisReqDto.getLangue());


     return quoteClient.WSI2_TracingColisDetailleIn(parameters);
    }
}
