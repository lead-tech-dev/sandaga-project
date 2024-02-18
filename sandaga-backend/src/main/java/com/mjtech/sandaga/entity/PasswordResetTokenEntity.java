package com.mjtech.sandaga.entity;


import org.hibernate.annotations.Type;

import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

import javax.persistence.*;

@Entity
@Table(name = "password_reset_token", schema = "sandagadb")
public class PasswordResetTokenEntity {
    private static final int EXPIRATION = 60 * 24;

    @Id
    @GeneratedValue
    @Column(name = "ID", updatable = false, nullable = false, columnDefinition = "uuid")
    @Type(type = "org.hibernate.type.PostgresUUIDType")
    private UUID id;

    @Column(name = "TOKEN")
    private String token;

    @Column(name = "EXPIRY_DATE")
    private Date expiryDate;

    @OneToOne(targetEntity = UserEntity.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private UserEntity user;


    public PasswordResetTokenEntity(final String token, final UserEntity user) {
        super();

        this.token = token;
        this.user = user;
        this.expiryDate = calculateExpiryDate(EXPIRATION);
    }
    public PasswordResetTokenEntity() {

    }

    public Date calculateExpiryDate(int expiryTimeInMinutes) {
        Date date = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MINUTE, expiryTimeInMinutes);
        return cal.getTime();
    }

    public void updateToken(final String token) {
        this.token = token;
        this.expiryDate = calculateExpiryDate(EXPIRATION);
    }

    public UUID getId() {
      return id;
    }
   public UserEntity getUser() {
      return user;
    }

    public Date getExpiryDate() {
    return expiryDate;
}
public void setExpiryDate(Date expiryDate) {
      this.expiryDate = expiryDate;
    }

@Override public String toString() {
    return "PasswordResetToken{" +
            "id=" + id +
            ", token='" + token + '\'' +
            ", expiryDate=" + expiryDate +
            ", user=" + user +
            '}';
}}
