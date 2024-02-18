package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.dtos.contact.ContactDto;
import com.mjtech.sandaga.entity.ContactEntity;
import com.mjtech.sandaga.repository.ContactRepository;
import com.mjtech.sandaga.service.ContactService;
import org.springframework.stereotype.Service;

@Service
public class ContactServiceImpl implements ContactService {
    private final ContactRepository contactRepository;

    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public ContactEntity createContact(ContactDto contactDto) {
        return contactRepository.save(ContactEntity.builder()
                        .firstname(contactDto.getFirstName())
                        .lastname(contactDto.getLastName())
                        .email(contactDto.getEmail())
                        .message(contactDto.getMessage())
                        .purchaseId(contactDto.getPurchaseId())
                        .type(contactDto.getType())
                        .phone(contactDto.getPhone())
                .build());
    }
}
