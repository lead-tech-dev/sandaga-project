package com.mjtech.sandaga.security;

/**
 * @author : github.com/maximan81
 * @project : Sandaga API Development with Spring and Spring Boot
 **/
public class Constants {
  public static final String ENCODER_ID = "bcrypt";
  public static final String API_URL_PREFIX = "/api/v1/**";
  public static final String H2_URL_PREFIX = "/h2-console/**";

  public static final String ACTUATOR_URL_PREFIX = "/actuator/**";
  public static final String SIGNUP_URL = "/api/v1/users";
  public static final String PUBLIC_IMAGE_URL = "/images/**";
  public static final String TOKEN_URL = "/api/v1/auth/token";

  public static final String VERIFY_TOKEN_URL = "/api/v1/auth/token/verify/**";
  public static final String FORGOT_PASSWORD_URL = "/api/v1/auth/forgot-password";
  public static final String RESET_PASSWORD_URL = "/api/v1/auth/reset-password";
  public static final String REFRESH_URL = "/api/v1/auth/token/refresh";
  public static final String CATEGORIES_URL = "/api/v1/categories/**";
  public static final String SUBCATEGORIES_URL = "/api/v1/subcategories/**";
  public static final String ADS_URL = "/api/v1/ads";

  public static final String PHONE_URL = "/api/v1/phone/**";

  public static final String USERS_ADS_URL = "/api/v1/users/adv/**";
  public static final String CONTACT_URL = "/api/v1/contacts";
  public static final String SEARCH_URL = "/api/v1/search/**";
  public static final String ADV_URL = "/adv/**";
  public static final String AUTHORIZATION = "Authorization";
  public static final String TOKEN_PREFIX = "Bearer ";
  public static final String SECRET_KEY = "SECRET_KEY";
  public static final long EXPIRATION_TIME = 900_000; // 15 mins
  public static final String ROLE_CLAIM = "roles";
  public static final String AUTHORITY_PREFIX = "ROLE_";
}
