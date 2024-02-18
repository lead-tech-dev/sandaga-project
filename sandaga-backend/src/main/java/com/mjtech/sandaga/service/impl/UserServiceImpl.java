package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.dtos.address.AddAddressReqDto;
import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.address.UpdateAddressReqDto;
import com.mjtech.sandaga.dtos.ads.AdsPageReqDto;
import com.mjtech.sandaga.dtos.ads.AdsSearchDto;
import com.mjtech.sandaga.dtos.auth.*;
import com.mjtech.sandaga.dtos.search.AdsSearchResDto;
import com.mjtech.sandaga.entity.*;
import com.mjtech.sandaga.enums.message.Status;
import com.mjtech.sandaga.exception.GenericAlreadyExistsException;
import com.mjtech.sandaga.exception.InvalidRefreshTokenException;
import com.mjtech.sandaga.exception.ResourceNotFoundException;
import com.mjtech.sandaga.repository.*;
import com.mjtech.sandaga.security.JwtManager;
import com.mjtech.sandaga.service.EmailService;
import com.mjtech.sandaga.service.UserService;
import com.mjtech.sandaga.utility.MailConstructor;
import com.mjtech.sandaga.utility.dto.Address;
import com.mjtech.sandaga.utility.dto.Ads;
import com.mjtech.sandaga.utility.dto.User;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.Principal;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * @author : github.com/maximan81
 * @project : Sandaga API Development with Spring and Spring Boot
 **/
@Service
public class UserServiceImpl implements UserService {

  private static String FRONTEND_URL = "http://localhost:3000";

  private final UserRepository repository;
  private final UserTokenRepository userTokenRepository;
  private final PasswordEncoder bCryptPasswordEncoder;

  private final AdsRepository adsRepository;

  private final FollowersRepository followersRepository;

  private final AddressRepository addressRepository;

  private final PasswordResetTokenRepository passwordResetTokenRepository;
  private final JwtManager tokenManager;

  private final MailConstructor mailConstructor;

  private final JavaMailSender mailSender;

  private final ChatRepository chatRepository;

  private final EmailService emailService;


  public UserServiceImpl(UserRepository repository, UserTokenRepository userTokenRepository,
                         PasswordEncoder bCryptPasswordEncoder, AdsRepository adsRepository, FollowersRepository followersRepository, AddressRepository addressRepository, PasswordResetTokenRepository passwordResetTokenRepository, JwtManager tokenManager, MailConstructor mailConstructor, JavaMailSender mailSender, ChatRepository chatRepository, EmailService emailService) {
    this.repository = repository;
    this.userTokenRepository = userTokenRepository;
    this.bCryptPasswordEncoder = bCryptPasswordEncoder;this.adsRepository = adsRepository;this.followersRepository = followersRepository;this.addressRepository = addressRepository;
    this.passwordResetTokenRepository = passwordResetTokenRepository;
    this.tokenManager = tokenManager;
  this.mailConstructor = mailConstructor;this.mailSender = mailSender;
    this.chatRepository = chatRepository;
    this.emailService = emailService;
  }

  @Override
  public UserEntity saveUser(UserEntity userEntity) {
    return repository.save(userEntity);
  }

  @Override
  public EmptyEntity deleteUserById(Principal principal) {
    UserEntity user = findUserByEmail(principal.getName());

    repository.deleteById(user.getId());
    return new EmptyEntity();
  }


  @Override
  public UserEntity getUserById(String id) {
    Optional<UserEntity> existsUser = repository.findById(UUID.fromString(id));

    if (existsUser.isEmpty()) {
      throw new ResourceNotFoundException("User not found!");
    }

    return existsUser.get();
  }

  @Override
  @Transactional
  public Optional<SignedInUserDto> createUser(SignUpReqDto signUpReqDto)throws  UnsupportedEncodingException, MessagingException  {
    //Integer count = repository.findByUsernameOrEmail(signInReqDto.getEmail(), signInReqDto.getEmail());

    Optional<UserEntity> existUser = repository.findExistUserByEmail(signUpReqDto.getEmail());

    if (existUser.isPresent()) {
      throw new GenericAlreadyExistsException("Utiliser une adresse e-mail différentes.");
    }

    signUpReqDto.setUserStatus("INACTIVE");

    UserEntity userEntity = repository.save(toEntity(signUpReqDto));

    String token = UUID.randomUUID().toString();
    createPasswordResetTokenForUser(userEntity, token);
    //String appUrl = "http//" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    String appUrl = FRONTEND_URL + "/verify?ref=active&code=" + token;
    String description = "Vérifiez votre inscription";
    Context context = new Context();
    //MimeMessage emailSend = mailConstructor.sendEmail(userEntity, appUrl, description, "VERIFY");
    //mailSender.send(emailSend);
    context.setVariable("name", signUpReqDto.getFirstName() + " " + signUpReqDto.getLastName());
    context.setVariable("description", description);
    context.setVariable("siteURL", appUrl);
    context.setVariable("href", "VERIFIER");

    emailService.sendEmail(userEntity, description, "generic-email", context);
    return Optional.of(createSignedUserWithRefreshToken(userEntity));
  }

  @Override
  @Transactional
  public SignedInUserDto getSignedInUser(UserEntity userEntity) {
    userTokenRepository.deleteByUserId(userEntity.getId());
    return createSignedUserWithRefreshToken(userEntity);
  }

  private SignedInUserDto createSignedUserWithRefreshToken(UserEntity userEntity) {
    return createSignedInUser(userEntity).setRefreshToken(createRefreshToken(userEntity));
  }

  private SignedInUserDto createSignedInUser(UserEntity userEntity) {

    String token = tokenManager.create(org.springframework.security.core.userdetails.User.builder()
            .username(userEntity.getUsername())
            .password(userEntity.getPassword())
            .authorities(Objects.nonNull(userEntity.getRole()) ? userEntity.getRole().name() : "")
            .build());

    return SignedInUserDto.builder()
          .role(userEntity.getRole().toString())
            .accessToken(token)
            .userId(userEntity.getId().toString())
            .build();
  }

  @Override
  public Optional<SignedInUserDto> getAccessToken(RefreshTokenDto refreshToken) {
    // You may add an additional validation for time that would remove/invalidate the refresh token

    return userTokenRepository.findByRefreshToken(refreshToken.getRefreshToken())
            .map(ut -> Optional.of(createSignedInUser(ut.getUser()).setRefreshToken(refreshToken.getRefreshToken())))
            .orElseThrow(() -> new InvalidRefreshTokenException("Invalid token."));
  }

  @Override
  public void removeRefreshToken(RefreshTokenDto refreshToken) {
    userTokenRepository.findByRefreshToken(refreshToken.getRefreshToken())
            .ifPresentOrElse(userTokenRepository::delete, () -> {
              throw new InvalidRefreshTokenException("Invalid token.");
            });
  }

  @Override
  public UserEntity findUserByEmail(String email) {
    if (Strings.isBlank(email)) {
      throw new UsernameNotFoundException("Invalid user.");
    }
    final String uname = email.trim();

    Optional<UserEntity> oUserEntity = repository.findByEmail(uname);

    UserEntity userEntity = oUserEntity.orElseThrow(
            () -> new UsernameNotFoundException(String.format("Given user(%s) not found.", uname)));


    return userEntity;
  }

  private UserEntity toEntity(SignUpReqDto user) {
    UserEntity userEntity = new UserEntity();
    BeanUtils.copyProperties(user, userEntity);
    userEntity.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
    userEntity.setCreatedAt(new Timestamp(new Date().getTime()));
    return userEntity;
  }

  private String createRefreshToken(UserEntity user) {
    String token = RandomHolder.randomKey(128);
    UserTokenEntity userToken = new UserTokenEntity();

    userToken.setRefreshToken(token);
    userToken.setUser(user);

    //userTokenRepository.save(new UserTokenEntity().setRefreshToken(token).setUser(user));
    userTokenRepository.save(userToken);
    return token;
  }


  @Override
  @Transactional
  public void createPasswordResetTokenForUser(UserEntity user, String token) {
    final PasswordResetTokenEntity myToken = new PasswordResetTokenEntity(token, user);
    passwordResetTokenRepository.save(myToken);
  }
  @Override
  public void verifyRegisterToken(String code) {

    Optional<PasswordResetTokenEntity> passToken = passwordResetTokenRepository.findByToken(code);

    if(passToken.isEmpty()) {
      throw new InvalidRefreshTokenException("Code de verification invalid!.");
    }

    PasswordResetTokenEntity token = passToken.get();

    if(Instant.now().compareTo(token.getExpiryDate().toInstant()) > 0) {
      throw new InvalidRefreshTokenException("Code de verification expiré!.");
    }

    UserEntity user = token.getUser();

   if(user.getUserStatus().equals("INACTIVE")) {
     user.setUserStatus("ACTIVE");

     repository.save(user);

     token.setExpiryDate(Date.from(Instant.now().minus(1, ChronoUnit.DAYS)));

     passwordResetTokenRepository.save(token);
   }
    //passwordResetTokenRepository.deleteById(passToken.get().getId());
  }

  @Override public void createUserForgotPasswordResetToken(String email)throws  UnsupportedEncodingException, MessagingException {
    Optional<UserEntity> user = repository.findByEmail(email);

    if(user.isEmpty()) {
      throw new ResourceNotFoundException("Aucun compte ne correspond, merci de vérifier votre adresse e-mail.");
    }

    UserEntity userEntity = user.get();

    String token = UUID.randomUUID().toString();
    createPasswordResetTokenForUser(userEntity, token);
    //String appUrl = "http//" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    String appUrl = FRONTEND_URL + "/verify?ref=reset&code=" + token;
    String description = "réinitialisez votre mot de passe";
    //MimeMessage emailSend = mailConstructor.sendEmail(userEntity, appUrl, description, "RESET");

    Context context = new Context();
    context.setVariable("name", userEntity.getFirstName() + " " + userEntity.getLastName());
    context.setVariable("description", description);
    context.setVariable("siteURL", appUrl);
    context.setVariable("href", "VERIFIER");

    emailService.sendEmail(userEntity, description, "generic-email", context);
  }

  @Override public void resetUserPassword(ResetPasswordUserDto resetPasswordUser) {

    Optional<PasswordResetTokenEntity> passToken = passwordResetTokenRepository.findByToken(resetPasswordUser.getToken());

    if(passToken.isEmpty()) {
      throw new InvalidRefreshTokenException("Code de verification invalid!.");
    }


    UserEntity user = passToken.get().getUser();


    user.setPassword(bCryptPasswordEncoder.encode(resetPasswordUser.getPassword()));

    repository.save(user);

    passToken.get().setExpiryDate(Date.from(Instant.now().minus(1, ChronoUnit.DAYS)));

    passwordResetTokenRepository.save(passToken.get());

  }

  @Override
  public UserPublicDataDto getPublicData(String userId, AdsPageReqDto adsPageReqDto) {
    UserEntity user = getUserById(userId);

    Pageable pageable = PageRequest.of(adsPageReqDto.getCurrentPage() - 1, adsPageReqDto.getLimit());

    Page<AdsEntity> page = adsRepository.findAdsEntityByUserId(user.getId(), pageable);

    return UserPublicDataDto.builder()
            .user(User.toDto(user))
            .relatedAds(AdsSearchResDto.builder()
                    .totalPages(page.getTotalPages())
                    .totalItems(page.getTotalElements())
                    .ads(Ads.toSearchDtoList(page.getContent()))
                    .build()
            )
            .build();
  }

  @Override
  public UserDto getPrivateData(Principal principal) {
    UserEntity user = findUserByEmail(principal.getName());
    List<ChatEntity> chats = chatRepository.findChatEntitiesByReceiverOrSender(user, user);
    int chatMessagePendingNumber = 0;

    for (ChatEntity chat: chats) {
      for (MessageEntity message: chat.getMessages()) {
        if (message.getDest().equals(user.getId()) && message.getStatus().equals(Status.pending)){
          chatMessagePendingNumber = chatMessagePendingNumber + 1;
        }
      }
    }

    UserDto userDto = User.toDto(user);
    userDto.setChatsMessagePendingNumber(chatMessagePendingNumber);
    return userDto;
  }

  @Override
  public EmptyEntity handlerUsersConnection(String userFollowerId, Principal principal) {
    UserEntity userFollower = findUserByEmail(principal.getName());

    Optional<UserEntity> userFollowing = repository.findById(UUID.fromString(userFollowerId));

    if (userFollowing.isEmpty()) {
      throw new ResourceNotFoundException("Requested user not found!");
    }

    Optional<FollowersEntity> followers = followersRepository.findByFollowerAndFollowing(userFollower, userFollowing.get());


    if (followers.isPresent()) {
      followersRepository.deleteById(followers.get().getId());
    }else {
      followersRepository.save(FollowersEntity.builder()
              .createdAt(Timestamp.from(Instant.now()))
              .follower(userFollower)
              .following(userFollowing.get())
              .build());

    }

    return new EmptyEntity();
  }

  @Override
  public EmptyEntity handlerUsersEmailSend(Principal principal)throws MessagingException, UnsupportedEncodingException  {
    UserEntity user = findUserByEmail(principal.getName());

      String token = UUID.randomUUID().toString();
      createPasswordResetTokenForUser(user, token);

      String appUrl = FRONTEND_URL + "/dashboard/mon-profile?code=" + token;
      String description = "modifier votre adresse email";

    Context context = new Context();
    context.setVariable("name", user.getFirstName() + " " + user.getLastName());
    context.setVariable("description", description);
    context.setVariable("siteURL", appUrl);
    context.setVariable("href", "MODIFIER");

    emailService.sendEmail(user, description, "generic-email", context);

    return new EmptyEntity();
  }

  @Override
  @Transactional
  public SignedInUserDto handlerUsersEmailUpdate(EmailUpdateDto emailUpdateDto) {

    Optional<PasswordResetTokenEntity> passToken = passwordResetTokenRepository.findByToken(emailUpdateDto.getCode());

    if(passToken.isEmpty()) {
      throw new InvalidRefreshTokenException("Code de verification invalid!.");
    }

    PasswordResetTokenEntity token = passToken.get();

    if(Instant.now().compareTo(token.getExpiryDate().toInstant()) > 0) {
      throw new InvalidRefreshTokenException("Code de verification expiré!.");
    }

    UserEntity user = token.getUser();

    user.setEmail(emailUpdateDto.getEmail());

    passwordResetTokenRepository.deleteById(token.getId());

    return createSignedUserWithRefreshToken(repository.save(user));
  }

  @Override
  @Transactional
  public AddressDto handlerUsersAddressUpdate(UpdateAddressReqDto updateAddressReqDto, Principal principal) {
    UserEntity user = findUserByEmail(principal.getName());
    Optional<AddressEntity> address = addressRepository.findById(UUID.fromString(updateAddressReqDto.getId()));

    if (address.isEmpty()) {
      throw new ResourceNotFoundException("Address no found");
    }

    address.get().setNumber(updateAddressReqDto.getNumber());
    address.get().setStreet(updateAddressReqDto.getStreet());
    address.get().setCity(updateAddressReqDto.getCity());
    address.get().setState(updateAddressReqDto.getState());
    address.get().setCountry(updateAddressReqDto.getCountry());
    address.get().setPincode(updateAddressReqDto.getPincode());

    addressRepository.save(address.get());
    //repository.save(user);

    return Address.toDto(address.get());
  }


  @Override
  @Transactional
  public AddressDto handlerUsersAddressAdd(AddAddressReqDto addAddressReqDto, Principal principal) {
    UserEntity user = findUserByEmail(principal.getName());
    AddressEntity address = addressRepository.save(AddressEntity.builder()
            .number(addAddressReqDto.getNumber())
            .street(addAddressReqDto.getStreet())
            .city(addAddressReqDto.getCity())
            .state(addAddressReqDto.getState())
            .country(addAddressReqDto.getCountry())
            .pincode(addAddressReqDto.getPincode())
            .build());

    user.setAddress(address);

    repository.save(user);

    return Address.toDto(address);
  }

  @Override
  public UserInfoDto handlerUsersInfoUpdate(UserInfoUpdateReqDto userInfoUpdateReqDto, Principal principal) {
    UserEntity user = findUserByEmail(principal.getName());

    if (userInfoUpdateReqDto.getCivility() != null) {
      user.setCivility(userInfoUpdateReqDto.getCivility());
    }

    if (userInfoUpdateReqDto.getFirstname() != null) {
      user.setFirstName(userInfoUpdateReqDto.getFirstname());
    }

    if (userInfoUpdateReqDto.getLastname() != null) {
      user.setLastName(userInfoUpdateReqDto.getLastname());
    }

    if (userInfoUpdateReqDto.getHidePhone() != null) {
      user.setHidePhone(Boolean.parseBoolean(userInfoUpdateReqDto.getHidePhone()));
    }

      if (userInfoUpdateReqDto.getPhone() != null) {
          user.setPhone(userInfoUpdateReqDto.getPhone());
      }


    UserEntity userRes = repository.save(user);

    return User.toUserInfoDto(userRes);
  }

  @Override
  public AdsSearchResDto getAuthUserAds(Principal principal, AdsPageReqDto adsPageReqDto) {
    UserEntity user = findUserByEmail(principal.getName());

    Pageable pageable = PageRequest.of(adsPageReqDto.getCurrentPage()- 1, adsPageReqDto.getLimit());

    Page<AdsEntity> page = adsRepository.findAdsEntityByUserId(user.getId(), pageable);

    return AdsSearchResDto.builder()
            .totalPages(page.getTotalPages())
            .totalItems(page.getTotalElements())
            .ads(Ads.toSearchDtoList(page.getContent()))
            .build();
  }


  // https://stackoverflow.com/a/31214709/109354
  // or can use org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric(n)
  private static class RandomHolder {
    static final Random random = new SecureRandom();
    public static String randomKey(int length) {
      return String.format("%"+length+"s", new BigInteger(length*5/*base 32,2^5*/, random)
              .toString(32)).replace('\u0020', '0');
    }
  }

}
