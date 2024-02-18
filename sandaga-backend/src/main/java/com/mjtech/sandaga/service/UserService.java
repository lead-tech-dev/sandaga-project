package com.mjtech.sandaga.service;

import com.mjtech.sandaga.dtos.address.AddAddressReqDto;
import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.address.UpdateAddressReqDto;
import com.mjtech.sandaga.dtos.ads.AdsPageReqDto;
import com.mjtech.sandaga.dtos.ads.AdsSearchDto;
import com.mjtech.sandaga.dtos.auth.*;
import com.mjtech.sandaga.dtos.search.AdsSearchResDto;
import com.mjtech.sandaga.entity.EmptyEntity;
import com.mjtech.sandaga.entity.UserEntity;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

/**
 * @author : github.com/maximan81
 * @project : Sandaga API Development with Spring and Spring Boot
 **/
public interface UserService {

  EmptyEntity deleteUserById(Principal principal);

  UserEntity getUserById(String id);

  Optional<SignedInUserDto> createUser(SignUpReqDto signUpReqDto)throws MessagingException, UnsupportedEncodingException, MessagingException;

  UserEntity findUserByEmail(String email);

  SignedInUserDto getSignedInUser(UserEntity userEntity);

  Optional<SignedInUserDto> getAccessToken(RefreshTokenDto refreshToken);

  void removeRefreshToken(RefreshTokenDto refreshToken);


  void createPasswordResetTokenForUser(final UserEntity user, final String token);
  void verifyRegisterToken(String code);

  void createUserForgotPasswordResetToken(String email)throws MessagingException, UnsupportedEncodingException;

  void resetUserPassword(ResetPasswordUserDto resetPasswordUser);
  UserPublicDataDto getPublicData(String userId, AdsPageReqDto adsPageReqDto);
  UserDto getPrivateData(Principal principal);

  UserEntity saveUser(UserEntity userEntity);

  EmptyEntity handlerUsersConnection(String userFollowerId, Principal principal);
  EmptyEntity handlerUsersEmailSend(Principal principal)throws MessagingException, UnsupportedEncodingException;
  SignedInUserDto handlerUsersEmailUpdate(EmailUpdateDto emailUpdateDto);
  AddressDto handlerUsersAddressUpdate(UpdateAddressReqDto updateAddressReqDto, Principal principal);
  AddressDto handlerUsersAddressAdd(AddAddressReqDto addAddressReqDto, Principal principal);
  UserInfoDto handlerUsersInfoUpdate(UserInfoUpdateReqDto userInfoUpdateReqDto, Principal principal);
  AdsSearchResDto getAuthUserAds(Principal principal, AdsPageReqDto adsPageReqDto);


}
