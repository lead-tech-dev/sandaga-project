package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.categories.*;
import com.mjtech.sandaga.service.CategoryService;
import com.mjtech.sandaga.utility.dto.Category;
import io.swagger.annotations.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;


@RestController
@Api(value = "Categories", description = "the Categories API")
public class CategoryController  {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @ApiOperation(value = "Returns all the matched categories", nickname = "queryCategories", notes = "Returns the categories that matches the given query criteria", response = CategoryDto.class, responseContainer = "List", tags={ "categories", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = CategoryDto.class, responseContainer = "List") })
    @GetMapping(
            value = "/api/v1/categories",
            produces = { "application/json" }
    )
    public ResponseEntity<Iterable<CategoryDto>> queryCategories() {
        return new ResponseEntity<>(Category.toDtoList(categoryService.getCategories()), HttpStatus.OK);
    }

    @ApiOperation(value = "Add a new category", nickname = "addCategory", notes = "Creates a new category", response = CategoryDto.class, tags={ "categories", })
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "For successful user creation.", response = CategoryDto.class) })
    @PostMapping(
            value = "/api/v1/categories",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<CategoryDto> addCategory(@ApiParam(value = "")  @Valid @RequestBody(required = false) CategoryDto categoryDto) {
        return ResponseEntity.ok(Category.toDto(categoryService.createCategory(categoryDto)));
    }

    @ApiOperation(value = "Returns a category", nickname = "getCategory", notes = "Returns the category that matches the given category ID", response = CategoryDto.class, tags={ "categories", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = CategoryDto.class) })
    @GetMapping(
            value = "/api/v1/categories/{id}",
            produces = { "application/json" }
    )
    public ResponseEntity<CategoryDto> getCategory(@ApiParam(value = "Category Identifier",required=true) @PathVariable("id") String id) {
        return null;
    }

    @ApiOperation(value = "Replace a category", nickname = "replaceCategoryById", notes = "Replace a category with given id.", response = CategoryDto.class, tags={ "categories", })
    @ApiResponses(value = {
            @ApiResponse(code = 204, message = "Category update successfully", response = CategoryDto.class),
            @ApiResponse(code = 404, message = "Given category ID doesn't exist") })
    @PutMapping(
            value = "/api/v1/categories/{id}",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<CategoryDto> replaceCategoryById(@ApiParam(value = "category Identifier",required=true) @PathVariable("id") String id,@ApiParam(value = "Category object"  )  @Valid @RequestBody(required = false) CategoryDto category) {
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    @ApiOperation(value = "Deletes category", nickname = "deleteCategoryById", notes = "Deletes category based on given card ID.", tags={ "categories", })
    @ApiResponses(value = {
            @ApiResponse(code = 202, message = "Accepts the deletion request and perform deletion. If ID does not exist, does nothing.") })
    @DeleteMapping(
            value = "/api/v1/categories/{id}"
    )
    public ResponseEntity<Void> deleteCategoryById(@ApiParam(value = "category Identifier",required=true) @PathVariable("id") String id) {
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }


}





