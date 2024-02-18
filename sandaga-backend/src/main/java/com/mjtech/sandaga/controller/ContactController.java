package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.contact.ContactDto;
import com.mjtech.sandaga.entity.ContactEntity;
import com.mjtech.sandaga.service.ContactService;
import com.mjtech.sandaga.utility.dto.Address;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class ContactController {
    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @ApiOperation(value = "Creates a new user contact", nickname = "createContact", notes = "Creates a new contact. .", response = ContactEntity.class, tags={ "contact", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = ContactEntity.class) })
    @PostMapping(
            value = "/api/v1/contacts",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<ContactEntity> createContact(@ApiParam(value = ""  )  @Valid @RequestBody(required = false) ContactDto contactDto) {

        return new ResponseEntity<>(contactService.createContact(contactDto), HttpStatus.CREATED);
    }
}
