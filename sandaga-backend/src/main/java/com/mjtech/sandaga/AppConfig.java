package com.mjtech.sandaga;

import com.bedatadriven.jackson.datatype.jts.JtsModule;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.LdapShaPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
import org.springframework.web.filter.ShallowEtagHeaderFilter;

import java.util.Map;

import static com.mjtech.sandaga.security.Constants.ENCODER_ID;

/**
 * @author : github.com/maximan81
 * @project : Sandaga API Development with Spring and Spring Boot
 **/
@Configuration
public class AppConfig {

  @Bean
  public ShallowEtagHeaderFilter shallowEtagHeaderFilter() {
    return new ShallowEtagHeaderFilter();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    // Supports other password encoding, a must for existing applications.
    // However, uses BCrypt for new passwords. This will allow to use new or future encoders
    Map<String, PasswordEncoder> encoders = Map.of(ENCODER_ID, new BCryptPasswordEncoder(),
            "pbkdf2", new Pbkdf2PasswordEncoder(), "scrypt", new SCryptPasswordEncoder());

    return new DelegatingPasswordEncoder(ENCODER_ID, encoders);
  }

  @Bean
  public ObjectMapper objectMapper() {
    ObjectMapper mapper = new ObjectMapper();
    mapper.registerModule(new JavaTimeModule());
    mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    return mapper;
  }

  @Bean
  public JtsModule jtsModule() {
    // This module will provide a Serializer for geometries
    return new JtsModule();
  }

}
