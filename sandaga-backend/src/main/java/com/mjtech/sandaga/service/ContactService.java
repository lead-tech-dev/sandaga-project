package com.mjtech.sandaga.service;

import com.mjtech.sandaga.dtos.contact.ContactDto;
import com.mjtech.sandaga.entity.ContactEntity;

public interface ContactService {
    ContactEntity createContact(ContactDto contactDto);
}
