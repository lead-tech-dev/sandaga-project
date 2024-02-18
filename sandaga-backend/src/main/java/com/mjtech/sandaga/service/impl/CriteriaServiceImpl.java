package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.entity.CriteriaEntity;
import com.mjtech.sandaga.dtos.criteria.CriteriaDto;
import com.mjtech.sandaga.exception.ResourceNotFoundException;
import com.mjtech.sandaga.repository.CriteriaRepository;
import com.mjtech.sandaga.service.CriteriaService;
import com.mjtech.sandaga.utility.dto.Criteria;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;


@Service
public class CriteriaServiceImpl implements CriteriaService {

    private final CriteriaRepository criteriaRepository;

    public CriteriaServiceImpl(CriteriaRepository criteriaRepository) {
        this.criteriaRepository = criteriaRepository;
    }


    @Override
    public CriteriaEntity addCriteria(CriteriaDto criteria) {
       return criteriaRepository.save(Criteria.toEntity(criteria));
    }
    @Override
    public CriteriaEntity updateCriteria(UUID id, CriteriaDto criteria) {
        Optional<CriteriaEntity> existsCriteria = criteriaRepository.findById(id);

        if (existsCriteria.isEmpty()) {
            throw new ResourceNotFoundException("Criteria not found!");
        }
        criteria.setId(String.valueOf(id));

        return criteriaRepository.save(Criteria.toUpdtateEntity(criteria));
    }
}
