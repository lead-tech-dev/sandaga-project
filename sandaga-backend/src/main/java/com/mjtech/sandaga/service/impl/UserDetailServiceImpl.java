package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.entity.UserEntity;
import com.mjtech.sandaga.repository.UserRepository;
import org.apache.logging.log4j.util.Strings;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author : github.com/maximan81
 * @project : Sandaga API Development with Spring and Spring Boot
 **/
@Service
public class UserDetailServiceImpl implements UserDetailsService {

  private UserRepository userRepo;

  public UserDetailServiceImpl(UserRepository userRepo) {
    this.userRepo = userRepo;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    if (Strings.isBlank(email)) {
      throw new UsernameNotFoundException("Invalid user.");
    }
    final String uname = email.trim();
    Optional<UserEntity> oUserEntity = userRepo.findByEmail(uname);
    UserEntity userEntity = oUserEntity.orElseThrow(
        () -> new UsernameNotFoundException(String.format("Given email(%s) not found.", uname)));
    return User.builder()
        .username(userEntity.getUsername())
        .password(userEntity.getPassword())
        .authorities(userEntity.getRole().getAuthority())
        .build();
  }
}
