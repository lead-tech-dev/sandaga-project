package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.categories.*;
import com.mjtech.sandaga.service.SubcategoryService;
import com.mjtech.sandaga.utility.dto.Subcategory;
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
public class SubcategoryController  {

    private final SubcategoryService subcategoryService;

    public SubcategoryController(SubcategoryService subcategoryService) {
        this.subcategoryService = subcategoryService;
    }


    @ApiOperation(value = "Add a new subcategory", nickname = "addSubcategory", notes = "Creates a new subcategory", response = SubcategoryDto.class, tags={ "subcategories", })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "For successful user creation.", response = SubcategoryDto.class) })
    @PostMapping(
            value = "/api/v1/subcategories",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
     public ResponseEntity<SubcategoryDto> addSubcategory(@ApiParam(value = "") @Valid @RequestBody(required = false) AddSubcategoryReqDto addSubcategoryReq) {
    return ResponseEntity.ok(Subcategory.toDto(subcategoryService.createSubcategory(addSubcategoryReq)));
    }


    @ApiOperation(value = "Deletes subcategory", nickname = "deleteSubcategoryById", notes = "Deletes subcategory based on given card ID.", tags={ "subcategories", })
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "Accepts the deletion request and perform deletion. If ID does not exist, does nothing.") })
    @DeleteMapping(
            value = "/api/v1/subcategories/{id}"
    )
    public ResponseEntity<Void> deleteSubcategoryById(@ApiParam(value = "subcategory Identifier",required=true) @PathVariable("id") String id) {
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    @ApiOperation(value = "Returns a subcategory", nickname = "getSubCategory", notes = "Returns the subcategory that matches the given subcategory ID", response = SubcategoryDto.class, tags={ "subcategories", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = SubcategoryDto.class) })
    @GetMapping(
            value = "/api/v1/subcategories/{id}",
            produces = { "application/json" }
    )
    public ResponseEntity<SubcategoryDto> getSubCategory(@ApiParam(value = "Subcategory Identifier",required=true) @PathVariable("id") String id) {

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    @ApiOperation(value = "Returns all the matched subcategories", nickname = "querySubcategories", notes = "Returns the subcategories that matches the given query criteria", response = SubcategoryDto.class, responseContainer = "List", tags={ "subcategories", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = SubcategoryDto.class, responseContainer = "List") })
    @GetMapping(
            value = "/api/v1/subcategories",
            produces = { "application/json" }
    )
    public ResponseEntity<List<SubcategoryDto>> querySubcategories() {

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    @ApiOperation(value = "Replace a subcategory", nickname = "replaceSubcategoryById", notes = "Replace a subcategory with given id.", response = SubcategoryDto.class, tags={ "subcategories", })
    @ApiResponses(value = {
            @ApiResponse(code = 204, message = "Subcategory update successfully", response = SubcategoryDto.class),
            @ApiResponse(code = 404, message = "Given subcategory ID doesn't exist") })
    @PutMapping(
            value = "/api/v1/subcategories/{id}",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<SubcategoryDto> replaceSubcategoryById(@ApiParam(value = "subcategory Identifier",required=true) @PathVariable("id") String id,@ApiParam(value = "Subcategory object"  )  @Valid @RequestBody(required = false) SubcategoryDto subcategory) {

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }
}


