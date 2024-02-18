package com.mjtech.sandaga.service;

import com.mjtech.sandaga.dtos.search.AdsSearchReqDto;
import com.mjtech.sandaga.dtos.search.AdsSearchResDto;
import com.mjtech.sandaga.dtos.search.AdsSuggestionsResDto;
import com.mjtech.sandaga.entity.*;
import com.mjtech.sandaga.dtos.ads.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AdsService {

    Iterable<AdsEntity> getAds();
    AdsEntity getAdsById(String id);

    AdsEntity saveAds(AdsEntity adsEntity);
    AdsEntity addAds(Principal principal, AdsReqDto adsReq);

    AdsSearchResDto searchAds(AdsSearchReqDto adsSearchReqDto);

    AdsEntity updateAds(Principal principal, String id, AdsUpdateReqDto adsUpdateReqDto);


    EmptyEntity removeAds(Principal principal, String id);

    List<AdsSuggestionsResDto> searchAdsSuggestion(String keyword);

    List<AdsSearchDto> searchAdsRecent();

    AdvDto getAdv(String adId, AdsPageReqDto adsPageReqDto);

    AdsEntity findAdsEntityByPayment(PaymentEntity paymentEntity);
}
