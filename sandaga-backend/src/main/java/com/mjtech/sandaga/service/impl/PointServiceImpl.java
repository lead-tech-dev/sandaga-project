package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.entity.AddressEntity;
import com.mjtech.sandaga.entity.AdsEntity;
import com.mjtech.sandaga.entity.PointEntity;
import com.mjtech.sandaga.exception.ResourceNotFoundException;
import com.mjtech.sandaga.dtos.point.*;
import com.mjtech.sandaga.repository.AdsRepository;
import com.mjtech.sandaga.repository.PointRepository;
import com.mjtech.sandaga.service.PointService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class PointServiceImpl implements PointService {

    private final PointRepository pointRepository;

    private final AdsRepository adsRepository;

    public PointServiceImpl(PointRepository pointRepository, AdsRepository adsRepository) {
        this.pointRepository = pointRepository;
    this.adsRepository = adsRepository;
    }
    @Override 
    public PointEntity addPoint(PointReqDto pointReq) {
        Optional<AdsEntity> existsAds = adsRepository.findById(UUID.fromString(pointReq.getAdsId()));

        if (existsAds.isEmpty()) {
            throw new ResourceNotFoundException("Ads not found");
        }


        return pointRepository.save(new PointEntity(
                UUID.randomUUID(),
                pointReq.getLongitude(),
                pointReq.getLatitude(), existsAds.get()));
    }

    @Override
    public PointEntity getPointById(String id) {

        Optional<PointEntity> existsPoint = pointRepository.findById(UUID.fromString(id));

        if (existsPoint.isEmpty()) {
            throw new ResourceNotFoundException("Point not found!");
        }

       return existsPoint.get();
    }

    @Override public PointEntity replacePointById(String id, PointDto point) {
        Optional<PointEntity> existsPoint = pointRepository.findById(UUID.fromString(id));

        if (existsPoint.isEmpty()) {
            throw new ResourceNotFoundException("Point not found!");
        }

        existsPoint.get().setLongitude(point.getLongitude());
        existsPoint.get().setLatitude(point.getLatitude());

       return pointRepository.save(existsPoint.get());
    }

    @Override public Void deletePointById(String id) {
        pointRepository.deleteById(UUID.fromString(id));
        return null;
    }

    @Override
    public List<PointEntity> getPoints() {
        return (List<PointEntity>) pointRepository.findAll();
    }




}
