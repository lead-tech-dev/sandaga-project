package com.mjtech.sandaga.service;


import com.mjtech.sandaga.entity.PointEntity;
import com.mjtech.sandaga.dtos.point.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PointService {
    PointEntity addPoint(PointReqDto pointReq);
    List<PointEntity> getPoints();
    PointEntity getPointById(String id);
    PointEntity replacePointById(String id, PointDto point);

    Void deletePointById(String id);}
