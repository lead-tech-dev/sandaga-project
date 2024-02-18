package com.mjtech.sandaga.service;



import com.mjtech.sandaga.dtos.mondialrelay.*;
import fr.mondialrelay.webservice.*;

import java.util.List;

public interface MondialRelayService {
    public WSI2TracingColisDetailleResponse WSI2_TracingColisDetailleIn(GetTrackingColisReqDto getTrackingColisReqDto);
    public GetStatLabelResDto WSI2_GetStatLabelSoapIn(GetStatLabelReqDto getStatLabelReqDto);
    public GetEtiquettesResDto WSI3_GetEtiquetteSoapIn(GetEtiquettesReqDto getEtiquettesReqDto);
    public CreationEtiquetteResDto WSI2_CreationEtiquetteSoapIn(CreationEtiquetteReqDto creationEtiquetteReqDto);
    List<PointRelaisDetails> WSI4_PointRelais_RechercheSoapIn(PointRelais_RechercheReqDto pointRelaisRechercheReqDto);
}
