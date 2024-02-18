package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.mondialrelay.*;
import com.mjtech.sandaga.service.MondialRelayService;
import fr.mondialrelay.webservice.PointRelaisDetails;
import fr.mondialrelay.webservice.WSI2CreationEtiquetteResponse;
import fr.mondialrelay.webservice.WSI2TracingColisDetailleResponse;
import fr.mondialrelay.webservice.WSI3GetEtiquettesResponse;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
public class MondialRelayController {
    private final MondialRelayService mondialRelayService;

    public MondialRelayController(MondialRelayService mondialRelayService) {
        this.mondialRelayService = mondialRelayService;
    }

    @ApiOperation(value = "return point relay details", nickname = "getWSI4_PointRelais_Recherche", notes = "return point relay details", response = PointRelaisDetails.class, tags={ "mondialRelay", })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "For successful data.", response = PointRelaisDetails.class) })
    @PostMapping(
            value = "/api/v1/wSI4_PointRelais_Recherche",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<List<PointRelaisDetails>>  getWSI4_PointRelais_Recherche(@Valid @RequestBody(required = false) PointRelais_RechercheReqDto pointRelaisRechercheReqDto) {
        return new ResponseEntity<List<PointRelaisDetails>>(mondialRelayService.WSI4_PointRelais_RechercheSoapIn(pointRelaisRechercheReqDto), HttpStatus.OK);
    }

    @ApiOperation(value = "return created étiquette data", nickname = "getWSI2_CreationEtiquetteSoapIn", notes = "return created étiquette data", response = CreationEtiquetteResDto.class, tags={ "mondialRelay", })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "For successful data.", response = CreationEtiquetteResDto.class) })
    @PostMapping(
            value = "/api/v1/wSI2_CreationEtiquette",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<CreationEtiquetteResDto>  getWSI2_CreationEtiquetteSoapIn(@Valid @RequestBody(required = false) CreationEtiquetteReqDto creationEtiquetteReqDto) {
        return new ResponseEntity<CreationEtiquetteResDto>(mondialRelayService.WSI2_CreationEtiquetteSoapIn(creationEtiquetteReqDto), HttpStatus.OK);
    }

    @ApiOperation(value = "return étiquette", nickname = "getWSI3_GetEtiquetteSoapIn", notes = "return étiquette", response = GetEtiquettesResDto.class, tags={ "mondialRelay", })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "For successful data.", response = GetEtiquettesResDto.class) })
    @PostMapping(
            value = "/api/v1/wSI3_GetEtiquettes",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<GetEtiquettesResDto>  getWSI3_GetEtiquetteSoapIn(@Valid @RequestBody(required = false) GetEtiquettesReqDto getEtiquettesReqDto) {
        return new ResponseEntity<GetEtiquettesResDto>(mondialRelayService.WSI3_GetEtiquetteSoapIn(getEtiquettesReqDto), HttpStatus.OK);
    }

    @ApiOperation(value = "return stat label", nickname = "getWSI3_GetEtiquetteSoapIn", notes = "return stat label", response = GetStatLabelResDto.class, tags={ "mondialRelay", })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "For successful data.", response = GetStatLabelResDto.class) })
    @PostMapping(
            value = "/api/v1/wSI2_Stat_Label",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<GetStatLabelResDto>  getWSI3_GetEtiquetteSoapIn(@Valid @RequestBody(required = false) GetStatLabelReqDto getStatLabelReqDto) {
        return new ResponseEntity<GetStatLabelResDto>(mondialRelayService.WSI2_GetStatLabelSoapIn(getStatLabelReqDto), HttpStatus.OK);
    }

    @ApiOperation(value = "return stat label", nickname = "wSI2_TracingColisDetailleIn", notes = "return stat label", response = WSI2TracingColisDetailleResponse.class, tags={ "mondialRelay", })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "For successful data.", response = WSI2TracingColisDetailleResponse.class) })
    @PostMapping(
            value = "/api/v1/wSI2_TracingColisDetaille",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<WSI2TracingColisDetailleResponse>  wSI2_TracingColisDetailleIn(@Valid @RequestBody(required = false) GetTrackingColisReqDto getTrackingColisReqDto) {
        return new ResponseEntity<WSI2TracingColisDetailleResponse>(mondialRelayService.WSI2_TracingColisDetailleIn(getTrackingColisReqDto), HttpStatus.OK);
    }
}
