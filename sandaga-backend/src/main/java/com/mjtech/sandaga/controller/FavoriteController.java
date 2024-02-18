package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.favoite.AddToFavoriteReqDto;
import com.mjtech.sandaga.dtos.favoite.FavoriteListReqDto;
import com.mjtech.sandaga.dtos.favoite.FavoriteListResDto;
import com.mjtech.sandaga.dtos.favoite.FavoritesDto;
import com.mjtech.sandaga.entity.EmptyEntity;
import com.mjtech.sandaga.service.FavoriteService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;

@RestController
public class FavoriteController {
    private final FavoriteService favoriteService;
    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @ApiOperation(value = "Returns success or error", nickname = "addUserAdsToFavorite", notes = "Returns success or error", response = EmptyEntity.class, responseContainer = "EmptyEntity", tags={ "favorites", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
    @PostMapping(
            value = "/api/v1/favorites",
            produces = { "application/json" }
    )
    public ResponseEntity<FavoritesDto> addUserAdsToFavorite(@Valid @RequestBody AddToFavoriteReqDto addToFavoriteReqDto, Principal principal) {
        return new ResponseEntity<FavoritesDto>(favoriteService.addUserAdsToFavorite(addToFavoriteReqDto, principal), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns user favorites list", nickname = "getUserAdsFavoriteList", notes = "Returns user favorites list", response = FavoriteListResDto.class, responseContainer = "FavoriteListResDto", tags={ "favorites", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = FavoriteListResDto.class, responseContainer = "FavoriteListResDto") })
    @PostMapping(
            value = "/api/v1/favorites/list",
            produces = { "application/json" }
    )
    public ResponseEntity<FavoriteListResDto> addUserAdsToFavorite(@Valid @RequestBody FavoriteListReqDto favoriteListReqDto, Principal principal) {
        return new ResponseEntity<>(favoriteService.getUserAdsFavoriteList(favoriteListReqDto, principal), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns success or error", nickname = "deleteUserAdsToFavorite", notes = "Returns success or error", response = EmptyEntity.class, responseContainer = "EmptyEntity", tags={ "favorites", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
    @DeleteMapping(
            value = "/api/v1/favorites/{id}",
            produces = { "application/json" }
    )
    public ResponseEntity<EmptyEntity> deleteUserAdsToFavorite(@PathVariable("id") String id, Principal principal) {
        return new ResponseEntity<EmptyEntity>(favoriteService.deleteUserAdsToFavorite(id, principal), HttpStatus.OK);

    }

}
