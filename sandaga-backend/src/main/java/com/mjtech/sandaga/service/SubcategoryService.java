package com.mjtech.sandaga.service;

import com.mjtech.sandaga.entity.SubcategoryEntity;
import com.mjtech.sandaga.dtos.categories.*;

import java.util.List;
import java.util.Optional;


public interface SubcategoryService {

    SubcategoryEntity getSubcategoryByID(String id);
    SubcategoryEntity createSubcategory(AddSubcategoryReqDto addSubcategoryReq);
    void deleteSubcategoryByID(String id);
}
