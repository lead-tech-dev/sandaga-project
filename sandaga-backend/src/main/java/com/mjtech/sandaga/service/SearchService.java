package com.mjtech.sandaga.service;

import com.mjtech.sandaga.dtos.search.AdsSearchReqDto;
import com.mjtech.sandaga.dtos.search.SearchListReqDto;
import com.mjtech.sandaga.dtos.search.SearchListResDto;
import com.mjtech.sandaga.entity.EmptyEntity;

import java.security.Principal;
import java.util.List;

public interface SearchService {
    AdsSearchReqDto addUserSearch(AdsSearchReqDto adsSearchReqDto, Principal principal);

    EmptyEntity deleteUserSearch(String id, Principal principal);

    SearchListResDto getUserSearch(Principal principal, SearchListReqDto searchListReqDto);
}
