package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.FollowersEntity;
import com.mjtech.sandaga.entity.UserEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface FollowersRepository extends CrudRepository<FollowersEntity, UUID> {

    Optional<FollowersEntity> findByFollowerAndFollowing(UserEntity follower, UserEntity following);
}
