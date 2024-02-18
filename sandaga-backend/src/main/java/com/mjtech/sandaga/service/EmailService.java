package com.mjtech.sandaga.service;


import javax.mail.internet.MimeMessage;

import com.mjtech.sandaga.entity.UserEntity;
import org.thymeleaf.context.Context;

public interface EmailService {
    void sendEmail(UserEntity user,  String description, String templateName, Context context);
}
