package com.mjtech.sandaga.controller;


import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.reviews.ReviewDto;
import com.mjtech.sandaga.dtos.reviews.ReviewReqDto;
import com.mjtech.sandaga.dtos.reviews.ReviewResDto;
import com.mjtech.sandaga.service.ReviewService;
import com.mjtech.sandaga.utility.dto.Reviews;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;


@RestController
public class ReviewController {

    private final ReviewService reviewService;
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @ApiOperation(value = "Add a new user review", nickname = "addReview", notes = "Add a new user review.", response = ReviewDto.class, tags={ "review", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = ReviewDto.class) })
    @PostMapping(
            value = "/api/v1/reviews",
            produces = { "application/json" },
            consumes = { "application/json" }
    )
    public ResponseEntity<ReviewResDto> addReview(@ApiParam(value = ""  )  @Valid @RequestBody(required = false) ReviewReqDto reviewReqDto) {

        return new ResponseEntity<>(Reviews.toResDto(reviewService.addReview(reviewReqDto)), HttpStatus.CREATED);
    }
}
