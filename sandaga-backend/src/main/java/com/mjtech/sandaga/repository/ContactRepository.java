package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.ContactEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface ContactRepository extends CrudRepository<ContactEntity, UUID> {
}
