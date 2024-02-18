package com.mjtech.sandaga.service;

import com.mjtech.sandaga.dtos.reviews.ReviewReqDto;
import com.mjtech.sandaga.entity.ReviewEntity;

public interface ReviewService {
    ReviewEntity addReview(ReviewReqDto reviewReqDto);
}
