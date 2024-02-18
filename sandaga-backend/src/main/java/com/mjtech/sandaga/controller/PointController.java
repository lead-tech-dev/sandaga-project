package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.point.*;
import com.mjtech.sandaga.service.PointService;
import com.mjtech.sandaga.utility.dto.Point;
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
public class PointController  {
    private final PointService pointService;

    public PointController(PointService pointService) {
        this.pointService = pointService;
    }

    @ApiOperation(value = "Add a new point", nickname = "addPoint", notes = "Creates a new point", response = PointDto.class, tags={ "points", })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "For successful user creation.", response = PointDto.class) })
    @PostMapping(
            value = "/api/v1/points",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<PointDto> addPoint(@ApiParam(value = ""  )  @Valid @RequestBody(required = false) PointReqDto pointReq) {

        return new ResponseEntity<>(Point.toDto(pointService.addPoint(pointReq)), HttpStatus.CREATED);
    }


    @ApiOperation(value = "Returns all points", nickname = "getAllPoints", notes = "Returns all points, else empty collection", response = PointDto.class, responseContainer = "List", tags={ "points", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = PointDto.class, responseContainer = "List") })
    @GetMapping(
            value = "/api/v1/points",
            produces = { "application/json" }
    )
    public ResponseEntity<List<PointDto>> getAllPoints() {
        return new ResponseEntity<>(Point.toDtoList(pointService.getPoints()), HttpStatus.OK);
    }

    @ApiOperation(value = "Returns an point", nickname = "getPointById", notes = "Returns point based on given point ID", response = PointDto.class, tags={ "points", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = PointDto.class) })
    @GetMapping(
            value = "/api/v1/points/{id}",
            produces = { "application/json" }
    )
    public ResponseEntity<PointDto> getPointById(@ApiParam(value = "Point Identifier",required=true) @PathVariable("id") String id) {
        return new ResponseEntity<>(Point.toDto(pointService.getPointById(id)), HttpStatus.OK);
    }

    @ApiOperation(value = "Replace a Point", nickname = "replacePointById", notes = "Replace an point with given id.", response = PointDto.class, tags={ "points", })
    @ApiResponses(value = {
            @ApiResponse(code = 204, message = "Point update successfully", response = PointDto.class),
            @ApiResponse(code = 404, message = "Given point ID doesn't exist") })
    @PutMapping(
            value = "/api/v1/points/{id}",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<PointDto> replacePointById(@ApiParam(value = "point Identifier",required=true) @PathVariable("id") String id,@ApiParam(value = "Point object"  )  @Valid @RequestBody(required = false) PointDto point) {
        return new ResponseEntity<>(Point.toDto(pointService.replacePointById(id,point)), HttpStatus.OK);
    }

    @ApiOperation(value = "Deletes an point", nickname = "deletePointById", notes = "Deletes an point based on given point ID.", tags={ "points", })
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "Accepts the deletion request and perform deletion. If ID does not exist, does nothing.") })
    @DeleteMapping(
            value = "/api/v1/points/{id}"
    )
    public ResponseEntity<Void> deletePointById(@ApiParam(value = "point Identifier",required=true) @PathVariable("id") String id) {

        return new ResponseEntity<Void>(pointService.deletePointById(id), HttpStatus.NO_CONTENT);
    }
}
