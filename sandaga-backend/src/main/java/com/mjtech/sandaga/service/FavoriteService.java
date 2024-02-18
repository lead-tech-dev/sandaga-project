package com.mjtech.sandaga.service;

import com.mjtech.sandaga.dtos.favoite.AddToFavoriteReqDto;
import com.mjtech.sandaga.dtos.favoite.FavoriteListReqDto;
import com.mjtech.sandaga.dtos.favoite.FavoriteListResDto;
import com.mjtech.sandaga.dtos.favoite.FavoritesDto;
import com.mjtech.sandaga.entity.EmptyEntity;

import java.security.Principal;

public interface FavoriteService {
    FavoritesDto addUserAdsToFavorite(AddToFavoriteReqDto addToFavoriteReqDto, Principal principal);

    EmptyEntity deleteUserAdsToFavorite(String id, Principal principal);

    FavoriteListResDto getUserAdsFavoriteList(FavoriteListReqDto favoriteListReqDto, Principal principal);
}
