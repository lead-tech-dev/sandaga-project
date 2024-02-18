package com.mjtech.sandaga.utility;

import com.mjtech.sandaga.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;


import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Properties;

@Component
public class MailConstructor {

    @Autowired
    private Environment env;

    @Autowired
    private JavaMailSender mailSender;

   public MimeMessage sendEmail(UserEntity user, String siteURL, String description, String href)
            throws UnsupportedEncodingException, MessagingException {
        String toAddress = user.getEmail();
        String fromAddress = "ericmaximan@gmail.com";
        String senderName = "sandaga";
        String subject = "Please " + description;
        String content = "Dear [[name]],<br>"
                + "Please click the link below to "+ description + " :<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">" + href + "</a></h3>"
                + "Thank you,<br>"
                + "Sandaga.";

       Properties props = new Properties();
       props.setProperty("mail.smtp.starttls.enable", "true");
       props.setProperty("mail.smtp.ssl.protocols", "TLSv1.2");

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);
       //helper.setFrom(env.getProperty("support.email"));

        content = content.replace("[[name]]", user.getFirstName() + " " + user.getLastName());

        content = content.replace("[[URL]]", siteURL);

        helper.setText(content, true);




       return  message;

    }


   /* public SimpleMailMessage sendVerificationEmail(UserEntity user, String siteURL, String token)
            throws UnsupportedEncodingException, MessagingException {
        String toAddress = user.getEmail();
        String fromAddress = "ericmaximan@gmail.com";
        String senderName = "Your company name";
        String subject = "Please verify your registration";
        String content = "Dear [[name]],<br>"
                + "Please click the link below to verify your registration:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h3>"
                + "Thank you,<br>"
                + "Your company name.";

        Properties props = new Properties();
        props.setProperty("mail.smtp.starttls.enable", "true");
        props.setProperty("mail.smtp.ssl.protocols", "TLSv1.2");

        SimpleMailMessage email = new SimpleMailMessage();

        email.setTo(toAddress);
        email.setSubject(subject);
        //email.setFrom(fromAddress);

        email.setFrom(env.getProperty("support.email"));


        content = content.replace("[[name]]", user.getFirstName() + user.getLastName());
        String verifyURL = siteURL + "/verify?code=" + token;

        content = content.replace("[[URL]]", verifyURL);

        email.setText(content);




        return  email;

    }*/
}
