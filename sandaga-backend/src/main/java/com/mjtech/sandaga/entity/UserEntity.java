package com.mjtech.sandaga.entity;

import com.mjtech.sandaga.enums.message.MessageType;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * @author : github.com/maximan81
 * @project : Sandaga API Development with Spring and Spring Boot
 **/
@Entity
@Table(name = "users", schema = "sandagadb")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity {
  @Id
  @GeneratedValue
  @Column(name = "ID", updatable = false, nullable = false, columnDefinition="uuid")
  @Type(type = "org.hibernate.type.PostgresUUIDType")
  private UUID id;

  @Column(name = "CIVILITY")
  private String civility;

  @Column(name = "PASSWORD")
  private String password;

  @Column(name = "FIRST_NAME")
  private String firstName;

  @Column(name = "LAST_NAME")
  private String lastName;

  @Column(name = "EMAIL")
  private String email;

  @Column(name = "PHONE")
  private String phone;

  @Column(name = "HIDE_PHONE")
  private boolean hidePhone;

  @Column(name = "USER_STATUS")
  private String userStatus;

  @Column(name = "ACCOUNT_TYPE")
  private Integer accountType;

  @Column(name = "USER_TYPE")
  @Enumerated(EnumType.STRING)
  private MessageType type;

  @Column(name = "CURRENT_CHAT")
  private String currentChat;

  @Column(name = "CREATED_AT")
  private Timestamp createdAt;

  @Column(name = "STRIPE_USER_ID")
  private String stripeUserId;

  @Column(name = "STRIPE_CUSTOMER_ID")
  private String stripeCustomerId;

  @Column(name = "ROLE")
  @Enumerated(EnumType.STRING)
  private RoleEnum role = RoleEnum.USER;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<AdsEntity> ads = Collections.emptyList();

  @OneToOne(orphanRemoval = true, cascade = CascadeType.REMOVE)
  private AddressEntity address;

  @OneToMany(mappedBy = "following", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<FollowersEntity> followings = Collections.emptyList();

  @OneToMany(mappedBy = "follower", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<FollowersEntity> followers = Collections.emptyList();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ReviewEntity> reviews = Collections.emptyList();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<UserTokenEntity> tokens = Collections.emptyList();

  @OneToOne(mappedBy = "user", orphanRemoval = true, cascade = CascadeType.REMOVE)
  private ImageEntity image;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  List<FavoriteEntity> favorites = Collections.emptyList();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  List<SearchEntity> searches = Collections.emptyList();

  @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
  List<PaymentEntity> sellers = Collections.emptyList();

  @OneToMany(mappedBy = "buyer", cascade = CascadeType.ALL, orphanRemoval = true)
  List<PaymentEntity> buyers = Collections.emptyList();

  @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ChatEntity> receivers = Collections.emptyList();

  @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ChatEntity> senders = Collections.emptyList();


  public UUID getId() {
    return id;
  }

  public UserEntity setId(UUID id) {
    this.id = id;
    return this;
  }

  public String getUsername() {
    return email;
  }



  public String getPassword() {
    return password;
  }

  public UserEntity setPassword(String password) {
    this.password = password;
    return this;
  }

  public String getFirstName() {
    return firstName;
  }

  public UserEntity setFirstName(String firstName) {
    this.firstName = firstName;
    return this;
  }

  public String getLastName() {
    return lastName;
  }

  public UserEntity setLastName(String lastName) {
    this.lastName = lastName;
    return this;
  }

  public String getEmail() {
    return email;
  }

  public UserEntity setEmail(String email) {
    this.email = email;
    return this;
  }

  public String getPhone() {
    return phone;
  }

  public UserEntity setPhone(String phone) {
    this.phone = phone;
    return this;
  }

  public String getUserStatus() {
    return userStatus;
  }

  public UserEntity setUserStatus(String userStatus) {
    this.userStatus = userStatus;
    return this;
  }

  public Integer getAccountType() {
    return accountType;
  }
  public void setAccountType(Integer accountType) {
    this.accountType = accountType;
  }
  public Timestamp getCreatedAt() {
    return createdAt;
  }
  public void setCreatedAt(Timestamp createdAt) {
    this.createdAt = createdAt;
  }



  public RoleEnum getRole() {
    return role;
  }

  public UserEntity setRole(RoleEnum role) {
    this.role = role;
    return this;
  }


@Override public String toString() {
    return "UserEntity{" +
            "id=" + id +
            ", password='" + password + '\'' +
            ", firstName='" + firstName + '\'' +
            ", lastName='" + lastName + '\'' +
            ", email='" + email + '\'' +
            ", phone='" + phone + '\'' +
            ", userStatus='" + userStatus + '\'' +
            ", accountType=" + accountType +
            ", createdAt=" + createdAt +
            ", role=" + role +
            '}';
}}
