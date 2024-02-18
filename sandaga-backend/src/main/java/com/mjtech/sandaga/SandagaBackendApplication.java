package com.mjtech.sandaga;

import com.mjtech.sandaga.config.TwilioConfig;
import com.twilio.Twilio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


import javax.annotation.PostConstruct;


@SpringBootApplication
@EnableScheduling
public class SandagaBackendApplication {

    @Autowired
    private TwilioConfig twilioConfig;
    @PostConstruct
    public void initTwilio(){
        Twilio.init(twilioConfig.getAccountSid(),twilioConfig.getAuthToken());
    }
    public static void main(String[] args) {
        SpringApplication.run(SandagaBackendApplication.class, args);
    }

}
