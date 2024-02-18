package com.mjtech.sandaga.service;

import com.mjtech.sandaga.dtos.criteria.CriteriaDto;
import com.mjtech.sandaga.entity.CriteriaEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface CriteriaService {
     CriteriaEntity addCriteria(CriteriaDto criteria);
     CriteriaEntity updateCriteria(UUID id, CriteriaDto criteria);

}
