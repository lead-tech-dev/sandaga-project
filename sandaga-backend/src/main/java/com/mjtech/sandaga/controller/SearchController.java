package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.favoite.AddToFavoriteReqDto;
import com.mjtech.sandaga.dtos.search.AdsSearchReqDto;
import com.mjtech.sandaga.dtos.search.SearchListReqDto;
import com.mjtech.sandaga.dtos.search.SearchListResDto;
import com.mjtech.sandaga.entity.EmptyEntity;
import com.mjtech.sandaga.service.SearchService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
public class SearchController {
    private final SearchService searchService;
    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @ApiOperation(value = "Returns success or error", nickname = "addUserSearch", notes = "Returns success or error", response = EmptyEntity.class, responseContainer = "EmptyEntity", tags={ "searches", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
    @PostMapping(
            value = "/api/v1/searches",
            produces = { "application/json" }
    )
    public ResponseEntity<AdsSearchReqDto> addUserSearch(@Valid @RequestBody AdsSearchReqDto adsSearchReqDto, Principal principal) {
        return new ResponseEntity<AdsSearchReqDto>(searchService.addUserSearch(adsSearchReqDto, principal), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns success or error", nickname = "deleteUserSearch", notes = "Returns success or error", response = EmptyEntity.class, responseContainer = "EmptyEntity", tags={ "searches", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
    @DeleteMapping(
            value = "/api/v1/searches/{id}",
            produces = { "application/json" }
    )
    public ResponseEntity<EmptyEntity> deleteUserSearch(@PathVariable("id") String id, Principal principal) {
        return new ResponseEntity<EmptyEntity>(searchService.deleteUserSearch(id, principal), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns user searches list", nickname = "getUserSearch", notes = "Returns user searches list", response = AdsSearchReqDto.class, responseContainer = "AdsSearchReqDto", tags={ "searches", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = AdsSearchReqDto.class, responseContainer = "AdsSearchReqDto") })
    @PostMapping(
            value = "/api/v1/searches/user",
            produces = { "application/json" }
    )
    public ResponseEntity<SearchListResDto> getUserSearch(Principal principal, @RequestBody SearchListReqDto searchListReqDto) {
        return new ResponseEntity<>(searchService.getUserSearch(principal, searchListReqDto), HttpStatus.OK);

    }
}
