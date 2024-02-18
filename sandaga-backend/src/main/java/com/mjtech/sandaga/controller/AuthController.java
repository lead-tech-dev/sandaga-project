package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.address.AddAddressReqDto;
import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.address.UpdateAddressReqDto;
import com.mjtech.sandaga.dtos.ads.AdsSearchDto;
import com.mjtech.sandaga.dtos.ads.AdsPageReqDto;
import com.mjtech.sandaga.dtos.auth.*;
import com.mjtech.sandaga.dtos.connection.ConnectionReqDto;
import com.mjtech.sandaga.dtos.search.AdsSearchResDto;
import com.mjtech.sandaga.entity.EmptyEntity;
import com.mjtech.sandaga.entity.UserEntity;
import com.mjtech.sandaga.exception.InvalidRefreshTokenException;

import com.mjtech.sandaga.service.UserService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import javax.mail.MessagingException;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.List;

import static org.springframework.http.ResponseEntity.*;

/**
 * @author : github.com/maximan81
 * @project : Sandaga API Development with Spring and Spring Boot
 **/
@RestController
public class AuthController  {
  private final UserService service;
  private final PasswordEncoder passwordEncoder;

  public AuthController(UserService service, PasswordEncoder passwordEncoder) {
    this.service = service;
    this.passwordEncoder = passwordEncoder;
  }


  @ApiOperation(value = "Provides new JWT based on valid refresh token.", nickname = "getAccessToken", notes = "Provides new JWT based on valid refresh token.", response = SignedInUserDto.class, tags={ "user" })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For successful operation.", response = SignedInUserDto.class) })
  @PostMapping(
          value = "/api/v1/auth/token/refresh",
          produces = { "application/json" },
          consumes = { "application/json" }
  )
  public ResponseEntity<SignedInUserDto> getAccessToken(@RequestBody @Valid RefreshTokenDto refreshToken) {
    return ok(service.getAccessToken(refreshToken).orElseThrow(InvalidRefreshTokenException::new));
  }


  @ApiOperation(value = "Signin the customer (user)", nickname = "signIn", notes = "Signin the customer (user) that generates the JWT (access token) and refresh token, which can be used for accessing APIs.", response = SignedInUserDto.class, tags={ "user" })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For user sign-in. Once successful, user receives the access and refresh token.", response = SignedInUserDto.class) })
  @PostMapping(
          value = "/api/v1/auth/token",
          produces = { "application/json" },
          consumes = { "application/json" }
  )
  public ResponseEntity<SignedInUserDto> signIn(@RequestBody @Valid SignInReqDto signInReq) {
    UserEntity userEntity = service.findUserByEmail(signInReq.getEmail());

    if (passwordEncoder.matches(signInReq.getPassword(), userEntity.getPassword())) {
      return ok(service.getSignedInUser(userEntity));
    }
    throw new InsufficientAuthenticationException("Unauthorized.");
  }

  @ApiOperation(value = "Signouts the customer (user)", nickname = "signOut", notes = "Signouts the customer (user). It removes the refresh token from DB. Last issued JWT should be removed from client end that if not removed last for given expiration time.", tags={ "user" })
  @ApiResponses(value = {
          @ApiResponse(code = 202, message = "Accepts the request for logout.") })
  @DeleteMapping(
          value = "/api/v1/auth/token",
          consumes = { "application/json" }
  )
  public ResponseEntity<Void> signOut(@RequestBody @Valid RefreshTokenDto refreshToken) {
    service.removeRefreshToken(refreshToken);
    return accepted().build();
  }


  @ApiOperation(value = "Signup the a new user", nickname = "signUp", notes = "Creates a new user, who can login. testing", response = SignedInUserDto.class, tags={ "user", })
  @ApiResponses(value = {
  @ApiResponse(code = 201, message = "For successful user creation", response = SignedInUserDto.class) })
  @PostMapping(value = "/api/v1/users")
  public ResponseEntity<SignedInUserDto> signUp(@RequestBody @Valid SignUpReqDto signUpReqDto) {
    // Have a validation for all required fields.
    try {

      return new ResponseEntity<>(service.createUser(signUpReqDto).get(), HttpStatus.CREATED);
    }  catch (UnsupportedEncodingException e) {
          throw new RuntimeException(e);
    }catch (MessagingException e) {
    throw new RuntimeException(e);
}
  }

  @ApiOperation(value = "Token for verification new register user.", nickname = "verifyUserByToken", notes = "Token for verification new register user.", response = Object.class, tags={ "user" })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For successful operation.", response = Object.class) })
  @GetMapping(
          value = "/api/v1/auth/token/verify/{code}",
          produces = { "application/json" }
  )
  public ResponseEntity<Object> verifyUserByToken(@PathVariable String code) {
    service.verifyRegisterToken(code);
    return ok(new EmptyEntity());
  }


  @ApiOperation(value = "Process email for user password forgot.", nickname = "forgotUserPassword", notes = "Process email for user password forgot.", response = Object.class, tags={ "user" })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For successful operation.", response = Object.class) })
  @PostMapping(
          value = "/api/v1/auth/forgot-password",
          produces = { "application/json" },
          consumes = { "application/json" }
  )
  public ResponseEntity<Object> forgotUserPassword(@RequestBody @Valid ForgotPasswordUserDto forgotPasswordUser) {
    try {
service.createUserForgotPasswordResetToken(forgotPasswordUser.getEmail());}  catch (UnsupportedEncodingException e) {
        throw new RuntimeException(e);
    }catch (MessagingException e) {
    throw new RuntimeException(e);
}
    return ok(new EmptyEntity());
  }


  @ApiOperation(value = "Reset user password.", nickname = "resetUserPassword", notes = "Reset user password.", response = Object.class, tags={ "user" })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For successful operation.", response = Object.class) })
  @PostMapping(
          value = "/api/v1/auth/reset-password",
          produces = { "application/json" },
          consumes = { "application/json" }
  )
  public ResponseEntity<Object> resetUserPassword(@RequestBody @Valid ResetPasswordUserDto resetPasswordUser) {
    service.resetUserPassword(resetPasswordUser);
    return ok(new EmptyEntity());
  }

  @ApiOperation(value = "Returns user with related ads", nickname = "getPublicData", notes = "Returns user with related ads", response = UserPublicDataDto.class, responseContainer = "UserPublicDataDto", tags={ "users", })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For successful fetch.", response = UserPublicDataDto.class, responseContainer = "UserPublicDataDto") })
  @PostMapping(
          value = "/api/v1/users/adv/{userId}",
          produces = { "application/json" }
  )
  public ResponseEntity<UserPublicDataDto> getPublicData(@PathVariable String userId, @RequestBody AdsPageReqDto adsPageReqDto) {
    return new ResponseEntity<UserPublicDataDto>(service.getPublicData(userId, adsPageReqDto), HttpStatus.OK);

  }

  @ApiOperation(value = "Returns user", nickname = "getPrivateData", notes = "Returns user", response = UserDto.class, responseContainer = "UserDto", tags={ "users", })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For successful fetch.", response = UserDto.class, responseContainer = "UserDto") })
  @GetMapping(
          value = "/api/v1/users/me",
          produces = { "application/json" }
  )
  public ResponseEntity<UserDto> getPrivateData(Principal principal) {
    return new ResponseEntity<UserDto>(service.getPrivateData(principal), HttpStatus.OK);

  }

  @ApiOperation(value = "Returns success or error", nickname = "handlerFollowers", notes = "Returns success or error", response = EmptyEntity.class, responseContainer = "EmptyEntity", tags={ "users", })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
  @PostMapping(
          value = "/api/v1/users/connect",
          produces = { "application/json" }
  )
  public ResponseEntity<EmptyEntity> handlerUsersConnection(@RequestBody ConnectionReqDto connectionReqDto, Principal principal) {
    return new ResponseEntity<EmptyEntity>(service.handlerUsersConnection(connectionReqDto.getUserFollowerId(), principal), HttpStatus.OK);

  }

  @ApiOperation(value = "Returns success or error", nickname = "handlerUsersEmailSend", notes = "Returns success or error", response = EmptyEntity.class, responseContainer = "EmptyEntity", tags={ "users", })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
  @PostMapping(
          value = "/api/v1/users/email/send",
          produces = { "application/json" }
  )
  public ResponseEntity<EmptyEntity> handlerUsersEmailSend(Principal principal)throws MessagingException, UnsupportedEncodingException {
    return new ResponseEntity<EmptyEntity>(service.handlerUsersEmailSend(principal), HttpStatus.OK);

  }

  @ApiOperation(value = "Returns sign in user", nickname = "handlerUsersEmailUpdate", notes = "Returns sign in user", response = SignedInUserDto.class, responseContainer = "SignedInUserDto", tags={ "users", })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
  @PostMapping(
          value = "/api/v1/users/email/update",
          produces = { "application/json" }
  )
  public ResponseEntity<SignedInUserDto> handlerUsersEmailUpdate(@RequestBody EmailUpdateDto emailUpdateDto)throws MessagingException, UnsupportedEncodingException {
    return new ResponseEntity<SignedInUserDto>(service.handlerUsersEmailUpdate(emailUpdateDto), HttpStatus.OK);

  }

  @ApiOperation(value = "Returns success or error", nickname = "handlerUsersAddressUpdate", notes = "Returns success or error", response = EmptyEntity.class, responseContainer = "EmptyEntity", tags={ "users", })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
  @PostMapping(
          value = "/api/v1/users/address/update",
          produces = { "application/json" }
  )
  public ResponseEntity<AddressDto> handlerUsersAddressUpdate(@RequestBody UpdateAddressReqDto updateAddressReqDto, Principal principal) {
    return new ResponseEntity<AddressDto>(service.handlerUsersAddressUpdate(updateAddressReqDto, principal), HttpStatus.OK);

  }

  @ApiOperation(value = "Returns success or error", nickname = "handlerUsersAddressAdd", notes = "Returns success or error", response = EmptyEntity.class, responseContainer = "EmptyEntity", tags={ "users", })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
  @PostMapping(
          value = "/api/v1/users/address/add",
          produces = { "application/json" }
  )
  public ResponseEntity<AddressDto> handlerUsersAddressAdd(@RequestBody AddAddressReqDto addAddressReqDto, Principal principal) {
    return new ResponseEntity<AddressDto>(service.handlerUsersAddressAdd(addAddressReqDto, principal), HttpStatus.OK);

  }

  @ApiOperation(value = "Returns success or error", nickname = "handlerUsersInfoUpdate", notes = "Returns success or error", response = EmptyEntity.class, responseContainer = "EmptyEntity", tags={ "users", })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
  @PostMapping(
          value = "/api/v1/users/info/update",
          produces = { "application/json" }
  )
  public ResponseEntity<UserInfoDto> handlerUsersInfoUpdate(@RequestBody UserInfoUpdateReqDto userInfoUpdateReqDto, Principal principal) {
    return new ResponseEntity<UserInfoDto>(service.handlerUsersInfoUpdate(userInfoUpdateReqDto, principal), HttpStatus.OK);

  }

  @ApiOperation(value = "Returns success or error", nickname = "deleteUserById", notes = "Returns success or error", response = EmptyEntity.class, responseContainer = "EmptyEntity", tags={ "users", })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
  @DeleteMapping(
          value = "/api/v1/users",
          produces = { "application/json" }
  )
  public ResponseEntity<EmptyEntity> deleteUserById(Principal principal) {
    return new ResponseEntity<EmptyEntity>(service.deleteUserById(principal), HttpStatus.OK);

  }

  @ApiOperation(value = "Returns user ads", nickname = "getAuthUserAds", notes = "Returns user ads", response = AdsSearchDto.class, responseContainer = "EmptyEntity", tags={ "users", })
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "For successful fetch.", response = AdsSearchDto.class, responseContainer = "EmptyEntity") })
  @PostMapping(
          value = "/api/v1/users/ads",
          produces = { "application/json" }
  )
  public ResponseEntity<AdsSearchResDto> getAuthUserAds(Principal principal, @RequestBody AdsPageReqDto adsPageReqDto) {
    return new ResponseEntity<>(service.getAuthUserAds(principal, adsPageReqDto), HttpStatus.OK);

  }


}




