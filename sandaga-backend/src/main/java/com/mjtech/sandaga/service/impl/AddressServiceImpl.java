package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.entity.AddressEntity;
import com.mjtech.sandaga.exception.ResourceNotFoundException;
import com.mjtech.sandaga.dtos.address.*;
import com.mjtech.sandaga.repository.AddressRepository;
import com.mjtech.sandaga.service.AddressService;
import com.mjtech.sandaga.utility.dto.Address;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    public AddressServiceImpl(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }
    @Override
    public AddressEntity createAddress(AddressDto addressDto) {
        return addressRepository.save(Address.toEntity(addressDto));
    }

    @Override public AddressEntity getAddressById(String id) {
        Optional<AddressEntity> address = addressRepository.findById(UUID.fromString(id));

        if(address.isEmpty()) {
            throw new ResourceNotFoundException("address not found!");
        }
        return address.get();
    }

    @Override
    public AddressEntity replaceAddressById(String id, AddressDto addressDto) {
        Optional<AddressEntity> existsAddress = addressRepository.findById(UUID.fromString(id));

        if(existsAddress.isEmpty()) {
            throw new ResourceNotFoundException("address not found!");
        }

        AddressEntity address = existsAddress.get();

        address.setNumber(addressDto.getNumber());
        address.setStreet(addressDto.getStreet());
        address.setPincode(addressDto.getPincode());
        address.setCity(addressDto.getCity());
        address.setState(addressDto.getState());
        address.setCountry(addressDto.getCountry());

        return addressRepository.save(address);
    }

    @Override
    public Void deleteAddressById(String id) {
        addressRepository.deleteById(UUID.fromString(id));
        return null;
    }
    @Override public List<AddressEntity> getAddresses() {
     return (List<AddressEntity>) addressRepository.findAll();
    }


}
