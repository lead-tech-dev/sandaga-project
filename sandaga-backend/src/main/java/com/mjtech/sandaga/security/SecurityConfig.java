package com.mjtech.sandaga.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mjtech.sandaga.entity.RoleEnum;
import com.mjtech.sandaga.security.UNUSED.ApiAccessDeniedHandler;
import com.mjtech.sandaga.security.UNUSED.ApiAuthenticationEntryPoint;
import com.mjtech.sandaga.security.UNUSED.FilterChainFailureHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.io.InputStream;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Arrays;

import static com.mjtech.sandaga.security.Constants.*;

/**
 * @author : github.com/maximan81
 * @project : Sandaga API Development with Spring and Spring Boot
 **/
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  private final Logger LOG = LoggerFactory.getLogger(getClass());
  private UserDetailsService userService;
  private PasswordEncoder bCryptPasswordEncoder;
  private ApiAccessDeniedHandler accessDeniedHandler;
  private ApiAuthenticationEntryPoint authenticationEntryPoint;
  private FilterChainFailureHandler failureHandler;
  private ObjectMapper mapper;

  @Value("${app.security.jwt.keystore-location}")
  private String keyStorePath;
  @Value("${app.security.jwt.keystore-password}")
  private String keyStorePassword;
  @Value("${app.security.jwt.key-alias}")
  private String keyAlias;
  @Value("${app.security.jwt.private-key-passphrase}")
  private String privateKeyPassphrase;

  public SecurityConfig(UserDetailsService userService,
      PasswordEncoder bCryptPasswordEncoder, ApiAccessDeniedHandler accessDeniedHandler,
      ApiAuthenticationEntryPoint authenticationEntryPoint,
      FilterChainFailureHandler failureHandler, ObjectMapper mapper) {
    this.userService = userService;
    this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    this.accessDeniedHandler = accessDeniedHandler;
    this.authenticationEntryPoint = authenticationEntryPoint;
    this.failureHandler = failureHandler;
    this.mapper = mapper;
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.httpBasic().disable().formLogin().disable()
        .csrf().ignoringAntMatchers(API_URL_PREFIX, H2_URL_PREFIX, PUBLIC_IMAGE_URL)
        .and()
        .headers().frameOptions().sameOrigin() // for H2 Console
        .and()
        .cors()
        .and()
        .authorizeRequests()
        .antMatchers(HttpMethod.POST, TOKEN_URL).permitAll()
        .antMatchers(HttpMethod.DELETE, TOKEN_URL).permitAll()
        .antMatchers(HttpMethod.POST, SIGNUP_URL).permitAll()
        .antMatchers(HttpMethod.POST, REFRESH_URL).permitAll()
        .antMatchers(HttpMethod.GET, VERIFY_TOKEN_URL).permitAll()
        .antMatchers(HttpMethod.POST, FORGOT_PASSWORD_URL).permitAll()
        .antMatchers(HttpMethod.POST, RESET_PASSWORD_URL).permitAll()
        .antMatchers(HttpMethod.GET,PUBLIC_IMAGE_URL).permitAll()
        .antMatchers(HttpMethod.GET, CATEGORIES_URL).permitAll()
        .antMatchers(HttpMethod.GET, SUBCATEGORIES_URL).permitAll()
        .antMatchers(HttpMethod.GET, ADV_URL).permitAll()
        .antMatchers(HttpMethod.POST, USERS_ADS_URL).permitAll()
        .antMatchers(HttpMethod.POST, CONTACT_URL).permitAll()
        .antMatchers(H2_URL_PREFIX).permitAll()
        .antMatchers(PHONE_URL).permitAll()
        .antMatchers(ACTUATOR_URL_PREFIX).permitAll()
        .antMatchers(HttpMethod.GET, ADS_URL).permitAll()
        .antMatchers(SEARCH_URL).permitAll()
        .antMatchers("/api/v1/ws/**").permitAll()
        .antMatchers(HttpMethod.GET, "/actuator/**").permitAll()
        .mvcMatchers(HttpMethod.POST, CATEGORIES_URL).hasAuthority(RoleEnum.ADMIN.getAuthority())
        .mvcMatchers(HttpMethod.PUT, CATEGORIES_URL).hasAuthority(RoleEnum.ADMIN.getAuthority())
        .mvcMatchers(HttpMethod.DELETE, CATEGORIES_URL).hasAuthority(RoleEnum.ADMIN.getAuthority())
        .mvcMatchers(HttpMethod.POST, SUBCATEGORIES_URL).hasAuthority(RoleEnum.ADMIN.getAuthority())
        .mvcMatchers(HttpMethod.PUT, SUBCATEGORIES_URL).hasAuthority(RoleEnum.ADMIN.getAuthority())
        .mvcMatchers(HttpMethod.DELETE, SUBCATEGORIES_URL).hasAuthority(RoleEnum.ADMIN.getAuthority())
        .anyRequest().authenticated()
        .and()
        /* Filter based security configuration
        .exceptionHandling().accessDeniedHandler(accessDeniedHandler)
        .and()
        .httpBasic()
        .authenticationEntryPoint(authenticationEntryPoint)
        .and()
        .addFilterBefore(failureHandler , BearerTokenAuthenticationFilter.class)
        .addFilter(new LoginFilter(super.authenticationManager(), mapper))
        .addFilter(new JwtAuthenticationFilter(super.authenticationManager()))
        */
        .oauth2ResourceServer(oauth2ResourceServer -> oauth2ResourceServer.jwt(
            jwt -> jwt.jwtAuthenticationConverter(getJwtAuthenticationConverter())))
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
  }

  private Converter<Jwt, AbstractAuthenticationToken> getJwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter authorityConverter = new JwtGrantedAuthoritiesConverter();
    authorityConverter.setAuthorityPrefix(AUTHORITY_PREFIX);
    authorityConverter.setAuthoritiesClaimName(ROLE_CLAIM);
    JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(authorityConverter);
    return converter;
  }

  @Override
  public void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(userService).passwordEncoder(bCryptPasswordEncoder);
  }

  @Bean
  @Override
  protected UserDetailsService userDetailsService() {
    return userService;
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowCredentials(true);
    configuration.setAllowedOriginPatterns(Arrays.asList("*"));
    configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH"));
    //configuration.setAllowCredentials(true);
    // For CORS response headers

    configuration.addAllowedOriginPattern("*");
    configuration.addAllowedHeader("*");
    configuration.addAllowedMethod("*");
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public KeyStore keyStore() {
    try {
      KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
      InputStream resourceAsStream = Thread.currentThread().getContextClassLoader()
          .getResourceAsStream(keyStorePath);
      keyStore.load(resourceAsStream, keyStorePassword.toCharArray());
      return keyStore;
    } catch (IOException | CertificateException | NoSuchAlgorithmException | KeyStoreException e) {
      LOG.error("Unable to load keystore: {}", keyStorePath, e);
    }

    throw new IllegalArgumentException("Unable to load keystore");
  }

  @Bean
  public RSAPrivateKey jwtSigningKey(KeyStore keyStore) {
    try {
      Key key = keyStore.getKey(keyAlias, privateKeyPassphrase.toCharArray());
      if (key instanceof RSAPrivateKey) {
        return (RSAPrivateKey) key;
      }
    } catch (UnrecoverableKeyException | NoSuchAlgorithmException | KeyStoreException e) {
      LOG.error("Unable to load private key from keystore: {}", keyStorePath, e);
    }
    throw new IllegalArgumentException("Unable to load private key");
  }

  @Bean
  public RSAPublicKey jwtValidationKey(KeyStore keyStore) {
    try {
      Certificate certificate = keyStore.getCertificate(keyAlias);
      PublicKey publicKey = certificate.getPublicKey();
      if (publicKey instanceof RSAPublicKey) {
        return (RSAPublicKey) publicKey;
      }
    } catch (KeyStoreException e) {
      LOG.error("Unable to load private key from keystore: {}", keyStorePath, e);
    }
    throw new IllegalArgumentException("Unable to load RSA public key");
  }

  @Bean
  public JwtDecoder jwtDecoder(RSAPublicKey rsaPublicKey) {
    return NimbusJwtDecoder.withPublicKey(rsaPublicKey).build();
  }
}