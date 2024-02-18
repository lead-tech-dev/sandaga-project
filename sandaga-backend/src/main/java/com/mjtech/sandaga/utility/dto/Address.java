package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.address.AddAddressReqDto;
import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.entity.AddressEntity;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Address {

    public static AddressDto toDto(AddressEntity e) {
        return AddressDto.builder()
                .id(String.valueOf(e.getId()))
                .number(e.getNumber())
                .street(e.getStreet())
                .pincode(e.getPincode())
                .city(e.getCity())
                .state(e.getState())
                .country(e.getCountry()).build();
    }

    public static List<AddressDto> toDtoList(List<AddressEntity> addresses) {
        if (Objects.isNull(addresses)) {
            return Collections.emptyList();
        }
        return addresses.stream().map(e -> toDto(e)).collect(Collectors.toList());
    }

    public static AddressEntity toEntity(AddressDto addressDto) {
        AddressEntity entity = new AddressEntity();
        entity.setNumber(addressDto.getNumber());
        entity.setStreet(addressDto.getStreet());
        entity.setPincode(addressDto.getPincode());
        entity.setCity(addressDto.getCity());
        entity.setState(addressDto.getState());
        entity.setCountry(addressDto.getCountry());
        return entity;
    }
}
