package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.address.*;
import com.mjtech.sandaga.service.AddressService;
import com.mjtech.sandaga.utility.dto.Address;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
public class AddressController {

    private final AddressService addressService;
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }


    @ApiOperation(value = "Returns all addresses", nickname = "getAllAddresses", notes = "Returns all  addresses, else empty collection", response = AddressDto.class, responseContainer = "List", tags={ "address", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = AddressDto.class, responseContainer = "List") })
    @GetMapping(
            value = "/api/v1/addresses",
            produces = { "application/json" }
    )
     public ResponseEntity<List<AddressDto>> getAllAddresses() {
    return ResponseEntity.ok(Address.toDtoList(addressService.getAddresses()));
    }

    @ApiOperation(value = "Creates a new user addresses", nickname = "createAddress", notes = "Creates a new user addresses. Does nothing if address already exists.", response = AddressDto.class, tags={ "address", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = AddressDto.class) })
    @PostMapping(
            value = "/api/v1/addresses",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<AddressDto> createAddress(@ApiParam(value = ""  )  @Valid @RequestBody(required = false) AddressDto addressDto) {

        return new ResponseEntity<>(Address.toDto(addressService.createAddress(addressDto)), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Returns an address", nickname = "getAddressesById", notes = "Returns an address based on given address ID.", response = AddressDto.class, tags={ "address", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = AddressDto.class) })
    @GetMapping(
            value = "/api/v1/addresses/{id}",
            produces = { "application/json" }
    )
    public ResponseEntity<AddressDto> getAddressesById(@ApiParam(value = "address Identifier",required=true) @PathVariable("id") String id) {

        return ResponseEntity.ok(Address.toDto(addressService.getAddressById(id)));
    }

    @ApiOperation(value = "Replace a Address", nickname = "replaceAddressById", notes = "Replace an address with given id.", response = AddressDto.class, tags={ "address", })
    @ApiResponses(value = {
            @ApiResponse(code = 204, message = "Address update successfully", response = AddressDto.class),
            @ApiResponse(code = 404, message = "Given address ID doesn't exist") })
    @PutMapping(
            value = "/api/v1/addresses/{id}",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<AddressDto> replaceAddressById(@ApiParam(value = "address Identifier",required=true) @PathVariable("id") String id,@ApiParam(value = "Address object"  )  @Valid @RequestBody(required = false) AddressDto addressDto) {

        return ResponseEntity.ok(Address.toDto(addressService.replaceAddressById(id, addressDto)));
    }

    @ApiOperation(value = "Deletes an address", nickname = "deleteAddressesById", notes = "Deletes an address based on given address ID.", tags={ "address", })
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "Accepts the deletion request and perform deletion. If ID does not exist, does nothing.") })
    @DeleteMapping(
            value = "/api/v1/addresses/{id}"
    )
    public ResponseEntity<Void> deleteAddressesById(@ApiParam(value = "address Identifier",required=true) @PathVariable("id") String id) {

        return new ResponseEntity<>(addressService.deleteAddressById(id), HttpStatus.NO_CONTENT);
    }

}
