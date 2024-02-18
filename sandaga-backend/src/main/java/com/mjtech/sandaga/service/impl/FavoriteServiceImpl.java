package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.dtos.favoite.FavoriteListReqDto;
import com.mjtech.sandaga.dtos.favoite.FavoriteListResDto;
import com.mjtech.sandaga.dtos.favoite.FavoritesDto;
import com.mjtech.sandaga.dtos.search.AdsSearchResDto;
import com.mjtech.sandaga.entity.FavoriteEntity;
import com.mjtech.sandaga.dtos.favoite.AddToFavoriteReqDto;
import com.mjtech.sandaga.entity.AdsEntity;
import com.mjtech.sandaga.entity.EmptyEntity;
import com.mjtech.sandaga.entity.UserEntity;
import com.mjtech.sandaga.exception.ResourceNotFoundException;
import com.mjtech.sandaga.repository.FavoriteRepository;
import com.mjtech.sandaga.service.AdsService;
import com.mjtech.sandaga.service.FavoriteService;
import com.mjtech.sandaga.service.UserService;
import com.mjtech.sandaga.utility.dto.Ads;
import com.mjtech.sandaga.utility.dto.Favorites;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Optional;
import java.util.UUID;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserService userService;
    private final AdsService adsService;
    public FavoriteServiceImpl(FavoriteRepository favoriteRepository, UserService userService, AdsService adsService) {
        this.favoriteRepository = favoriteRepository;this.userService = userService;
    this.adsService = adsService;}

    @Override
    public FavoritesDto addUserAdsToFavorite(AddToFavoriteReqDto addToFavoriteReqDto, Principal principal) {
        UserEntity user = userService.findUserByEmail(principal.getName());

        AdsEntity ads = adsService.getAdsById(addToFavoriteReqDto.getAdsId());

        ads.setFavorites(ads.getFavorites() + 1);

        adsService.saveAds(ads);

        FavoriteEntity favorite = favoriteRepository.save(
                FavoriteEntity.builder()
                        .user(user)
                        .ads(ads)
                        .build()
        );

        return Favorites.toDto(favorite);
    }

    @Override
    public FavoriteListResDto getUserAdsFavoriteList(FavoriteListReqDto favoriteListReqDto, Principal principal) {
        UserEntity user = userService.findUserByEmail(principal.getName());

        Pageable pageable = PageRequest.of(favoriteListReqDto.getCurrentPage() - 1, favoriteListReqDto.getLimit());

        Page<FavoriteEntity> page = favoriteRepository.findFavoriteEntityByUserId(user.getId(), pageable);

        return FavoriteListResDto.builder()
                .totalPages(page.getTotalPages())
                .totalItems(page.getTotalElements())
                .favorites(Favorites.toDtoList(page.getContent()))
                .build();
    }

    @Override
    public EmptyEntity deleteUserAdsToFavorite(String id, Principal principal) {

        Optional<FavoriteEntity> favorite = favoriteRepository.findById(UUID.fromString(id));

        if (favorite.isEmpty()) {
            throw new ResourceNotFoundException("Not found!");
        }

        AdsEntity ads = adsService.getAdsById(String.valueOf(favorite.get().getAds().getId()));

        ads.setFavorites(ads.getFavorites() - 1);

        adsService.saveAds(ads);

        favoriteRepository.deleteById(UUID.fromString(id));

        return new EmptyEntity();
    }
}
