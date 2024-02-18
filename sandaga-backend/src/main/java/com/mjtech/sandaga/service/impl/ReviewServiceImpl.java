package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.dtos.reviews.ReviewReqDto;
import com.mjtech.sandaga.entity.ReviewEntity;
import com.mjtech.sandaga.entity.UserEntity;
import com.mjtech.sandaga.repository.ReviewRepository;
import com.mjtech.sandaga.service.ReviewService;
import com.mjtech.sandaga.service.UserService;
import com.mjtech.sandaga.utility.dto.Reviews;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;


@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserService userService;
    public ReviewServiceImpl(ReviewRepository reviewRepository, UserService userService) {
        this.reviewRepository = reviewRepository;
    this.userService = userService;}

    @Override
    public ReviewEntity addReview(ReviewReqDto reviewReqDto) {
        UserEntity user = userService.getUserById(reviewReqDto.getUserReceiverId());

        if (reviewReqDto.getRating() > 5) {
            throw new BadCredentialsException("Please provide a correct rating value");
        }

        return reviewRepository.save(
                ReviewEntity.builder()
                        .name(reviewReqDto.getUserSenderName())
                        .review(reviewReqDto.getReview())
                        .createdAt(Timestamp.from(Instant.now()))
                        .rating(reviewReqDto.getRating())
                        .user(user)
                        .build()
        );
    }
}
