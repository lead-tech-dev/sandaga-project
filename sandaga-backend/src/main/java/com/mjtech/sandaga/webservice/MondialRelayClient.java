package com.mjtech.sandaga.webservice;

import com.google.gson.Gson;
import fr.mondialrelay.webservice.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;

public class MondialRelayClient extends WebServiceGatewaySupport {
    private static final Logger log = LoggerFactory.getLogger(MondialRelayClient.class);

    public WSI4PointRelaisRechercheResponse WSI4_PointRelais_RechercheSoapIn(WSI4PointRelaisRecherche parameters) {

        log.info("Requesting location for " + new Gson().toJson(parameters));


        return (WSI4PointRelaisRechercheResponse) getWebServiceTemplate()
                .marshalSendAndReceive("https://api.mondialrelay.com/Web_Services.asmx?WSDL", parameters,
                        new SoapActionCallback(
                                "http://www.mondialrelay.fr/webservice/WSI4_PointRelais_Recherche"));
    }
    public WSI2CreationEtiquetteResponse WSI2_CreationEtiquetteSoapIn(WSI2CreationEtiquette parameters) {

        log.info("Requesting location for " + new Gson().toJson(parameters));

        return (WSI2CreationEtiquetteResponse) getWebServiceTemplate()
                .marshalSendAndReceive("https://api.mondialrelay.com/Web_Services.asmx?WSDL", parameters,
                        new SoapActionCallback(
                                "http://www.mondialrelay.fr/webservice/WSI2_CreationEtiquette"));
    }

    public WSI3GetEtiquettesResponse WSI3_GetEtiquettesSoapIn(WSI3GetEtiquettes parameters) {

        log.info("Requesting location for " + new Gson().toJson(parameters));

        return (WSI3GetEtiquettesResponse) getWebServiceTemplate()
                .marshalSendAndReceive("https://api.mondialrelay.com/Web_Services.asmx?WSDL", parameters,
                        new SoapActionCallback(
                                "http://www.mondialrelay.fr/webservice/WSI3_GetEtiquettes"));
    }

    public WSI2STATLabelResponse WSI2_STAT_LabelSoapIn(WSI2STATLabel parameters) {

        log.info("Requesting location for " + new Gson().toJson(parameters));

        return (WSI2STATLabelResponse) getWebServiceTemplate()
                .marshalSendAndReceive("https://api.mondialrelay.com/Web_Services.asmx?WSDL", parameters,
                        new SoapActionCallback(
                                "http://www.mondialrelay.fr/webservice/WSI2_STAT_Label"));
    }

    public WSI2TracingColisDetailleResponse WSI2_TracingColisDetailleIn(WSI2TracingColisDetaille parameters) {

        log.info("Requesting location for " + new Gson().toJson(parameters));

        return (WSI2TracingColisDetailleResponse) getWebServiceTemplate()
                .marshalSendAndReceive("https://api.mondialrelay.com/Web_Services.asmx?WSDL", parameters,
                        new SoapActionCallback(
                                "http://www.mondialrelay.fr/webservice/WSI2_TracingColisDetaille"));
    }
}
