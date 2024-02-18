package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.ads.*;
import com.mjtech.sandaga.dtos.search.AdsSearchReqDto;
import com.mjtech.sandaga.dtos.search.AdsSearchResDto;
import com.mjtech.sandaga.dtos.search.AdsSuggestionsResDto;
import com.mjtech.sandaga.entity.EmptyEntity;
import com.mjtech.sandaga.entity.UserEntity;
import com.mjtech.sandaga.service.AdsService;
import com.mjtech.sandaga.service.UserService;
import com.mjtech.sandaga.utility.dto.Ads;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
public class AdsController {

    private final AdsService adsService;

    private final UserService userService;

    public AdsController(AdsService adsService, UserService userService) {
        this.adsService = adsService;
    this.userService = userService;}

    @ApiOperation(value = "Returns ads by criteria", nickname = "getAdsByCriteria", notes = "Returns all ads, else empty collection", response = AdsSearchResDto.class, responseContainer = "AdsSearchResDto", tags={ "ads", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = AdsSearchResDto.class, responseContainer = "AdsSearchResDto") })
    @PostMapping(
            value = "/api/v1/search",
            produces = { "application/json" }
    )
    public ResponseEntity<AdsSearchResDto> getAdsByCriteria(@ApiParam(value = ""  )  @Valid @RequestBody(required = false) AdsSearchReqDto adsSearchReqDto) {
        return new ResponseEntity<>(adsService.searchAds(adsSearchReqDto), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns ads search suggestions", nickname = "getAdsSearchSuggestion", notes = "Returns all ads, else empty collection", response = AdsSuggestionsResDto.class, responseContainer = "AdsSuggestionsResDto", tags={ "ads", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = AdsSuggestionsResDto.class, responseContainer = "AdsSuggestionsResDto") })
    @GetMapping(
            value = "/api/v1/search/suggestion/{keyword}",
            produces = { "application/json" }
    )
    public ResponseEntity<List<AdsSuggestionsResDto>> getAdsSearchSuggestion(@PathVariable String keyword) {
        return new ResponseEntity<>(adsService.searchAdsSuggestion(keyword), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns ads search recent", nickname = "getAdsSearchRecent", notes = "Returns all ads, else empty collection", response = AdsSuggestionsResDto.class, responseContainer = "AdsSuggestionsResDto", tags={ "ads", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = AdsSuggestionsResDto.class, responseContainer = "AdsSuggestionsResDto") })
    @GetMapping(
            value = "/api/v1/search/recent",
            produces = { "application/json" }
    )
    public ResponseEntity<List<AdsSearchDto>> getAdsSearchRecent() {
        return new ResponseEntity<List<AdsSearchDto>>(adsService.searchAdsRecent(), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns one ad with user related ads", nickname = "getAdv", notes = "Returns one ad with user related ads", response = AdvDto.class, responseContainer = "AdvDto", tags={ "ads", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = AdvDto.class, responseContainer = "AdvDto") })
    @PostMapping(
            value = "/api/v1/search/adv/{adId}",
            produces = { "application/json" }
    )
    public ResponseEntity<AdvDto> getAdv(@PathVariable String adId, @RequestBody AdsPageReqDto adsPageReqDto) {
        return new ResponseEntity<AdvDto>(adsService.getAdv(adId, adsPageReqDto), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns an public ad", nickname = "getPublicAdsById", notes = "Returns public ad based on given ad ID.", response = AdsDto.class, tags={ "ads", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = AdsDto.class) })
    @GetMapping(
            value = "/adv/{id}",
            produces = { "application/json" }
    )
    public ResponseEntity<AdsDto> getPublicAdsById(@ApiParam(value = "ad Identifier",required=true) @PathVariable("id") String id) {

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }


    @ApiOperation(value = "Returns an ads", nickname = "getAdsById", notes = "Returns ads based on given ads ID.", response = AdsDto.class, tags={ "ads", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = AdsDto.class) })
    @GetMapping(
            value = "/api/v1/ads/{id}",
            produces = { "application/json" }
    )
    public ResponseEntity<AdsDto> getAdsById(@ApiParam(value = "ads Identifier",required=true) @PathVariable("id") String id) {

        return new ResponseEntity<>(Ads.toDto(adsService.getAdsById(id)), HttpStatus.OK);
    }



    @ApiOperation(value = "Add a new ads", nickname = "addAds", notes = "Creates a new ads", response = AdsDto.class, tags={ "ads", })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "For successful user creation.", response = AdsDto.class) })
    @PostMapping(
            value = "/api/v1/ads",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<AdsDto> addAds(Principal principal, @ApiParam(value = ""  )  @Valid @RequestBody(required = false) AdsReqDto adsReq) {
        return new ResponseEntity<>(Ads.toDto(adsService.addAds(principal, adsReq)), HttpStatus.CREATED);
    }


    @ApiOperation(value = "Replace a ads", nickname = "replaceAdsById", notes = "Replace a ads with given id.", response = AdsUpdateReqDto.class, tags={ "ads", })
    @ApiResponses(value = {
            @ApiResponse(code = 204, message = "Ads update successfully", response = AdsUpdateReqDto.class),
            @ApiResponse(code = 404, message = "Given category ID doesn't exist") })
    @PutMapping(
            value = "/api/v1/ads/{id}",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<AdsDto> replaceAdsById(Principal principal, @ApiParam(value = "ads Identifier",required=true) @PathVariable("id") String id,@ApiParam(value = "Ads object"  )  @Valid @RequestBody(required = false) AdsUpdateReqDto adsUpdateReqDto) {
        return new ResponseEntity<>(Ads.toDto(adsService.updateAds(principal, id, adsUpdateReqDto)), HttpStatus.OK);

    }

    @ApiOperation(value = "Deletes ads", nickname = "deleteAdsById", notes = "Deletes ads based on given ads ID.", tags={ "ads", })
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "Accepts the deletion request and perform deletion. If ID does not exist, does nothing.") })
    @DeleteMapping(
            value = "/api/v1/ads/{id}"
    )
    public ResponseEntity<EmptyEntity> deleteAdsById(Principal principal, @ApiParam(value = "ads Identifier",required=true) @PathVariable("id") String id) {
        return new ResponseEntity<EmptyEntity>(adsService.removeAds(principal, id), HttpStatus.OK);

    }
}
