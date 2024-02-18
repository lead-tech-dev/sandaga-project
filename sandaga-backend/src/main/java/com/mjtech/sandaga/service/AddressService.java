package com.mjtech.sandaga.service;

import com.mjtech.sandaga.entity.AddressEntity;
import com.mjtech.sandaga.dtos.address.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AddressService {
    AddressEntity createAddress(AddressDto addressDto);

    List<AddressEntity> getAddresses();

    AddressEntity getAddressById(String id);

    AddressEntity replaceAddressById(String id, AddressDto addressDto);

    Void deleteAddressById(String id);}
