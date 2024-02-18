package com.mjtech.sandaga.repository;

import com.mjtech.sandaga.entity.UserEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.UUID;

/**
 * @author : github.com/maximan81
 * @project : Sandaga API Development with Spring and Spring Boot
 **/
public interface UserRepository extends CrudRepository<UserEntity, UUID> {

    //Optional<UserEntity> findByEmail(String email);

    @Query(value = "select * from sandagadb.users u where u.email = :email and u.user_status = 'ACTIVE' ", nativeQuery = true)
    Optional<UserEntity> findByEmail(String email);

    @Query(value = "select count(*) from sandagadb.users u where u.username = :username or u.email = :email", nativeQuery = true)
    Integer findByUsernameOrEmail(String username, String email);

    @Query(value = "select * from sandagadb.users u where u.email = :email", nativeQuery = true)
    Optional<UserEntity> findExistUserByEmail(String email);
}


