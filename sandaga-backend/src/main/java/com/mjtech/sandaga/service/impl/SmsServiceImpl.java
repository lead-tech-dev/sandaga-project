package com.mjtech.sandaga.service.impl;

import java.net.URI;
import java.text.DecimalFormat;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.mjtech.sandaga.config.TwilioConfig;
import com.mjtech.sandaga.dtos.otp.OptVerifyReqDto;
import com.mjtech.sandaga.dtos.otp.OtpStatusDto;
import com.mjtech.sandaga.dtos.otp.PhoneVerifyReqDto;
import com.mjtech.sandaga.dtos.otp.PhoneVerifyResDto;
import com.mjtech.sandaga.exception.ResourceNotFoundException;
import com.mjtech.sandaga.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Call;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;


@Service
public class SmsServiceImpl implements SmsService {
    @Autowired
    private TwilioConfig twilioConfig;

    private LoadingCache<String, String> optCache;

    private static final Integer EXPIRE_MINS = 5;
    public SmsServiceImpl() {
       this.optCache = CacheBuilder.newBuilder().expireAfterWrite(EXPIRE_MINS, TimeUnit.MINUTES).build(new CacheLoader<String,String>() {
           @Override
           public String load(String key) {
               return key.toUpperCase();
           }
       });
    }


    @Override
    public PhoneVerifyResDto sendSms(PhoneVerifyReqDto phoneVerifyReqDto) {
        PhoneVerifyResDto response = null;

        try {
            PhoneNumber to = new PhoneNumber(phoneVerifyReqDto.getPhone());
            PhoneNumber from = new PhoneNumber(twilioConfig.getTrialNumber());
            String otp = generateOTP(phoneVerifyReqDto.getPhone());
            String otpMessage = "Your OTP is ##" + otp + "##. Use this Passcode to verify your number.";
            Message message = Message
                    .creator(to, from,
                            otpMessage)
                    .create();

            response = PhoneVerifyResDto.builder()
                    .status(OtpStatusDto.DELIVERED)
                    .message(otpMessage)
                    .build();

        } catch (Exception ex) {
            response = PhoneVerifyResDto.builder()
                    .status(OtpStatusDto.FAILED)
                    .message(ex.getMessage())
                    .build();
        }

        return response;
    }

    @Override
    public PhoneVerifyResDto verifySms(OptVerifyReqDto optVerifyReqDto) {
        if (!String.valueOf(optVerifyReqDto.getOtp()).equals(getOtp(optVerifyReqDto.getPhone()))) {
            throw new ResourceNotFoundException("Invalid otp");
        }

        clearOtp(optVerifyReqDto.getPhone());

        return PhoneVerifyResDto.builder()
                .status(OtpStatusDto.VERIFIED)
                .message("Votre numéro a été vérifié !")
                .build();
    }

    private String generateOTP(String key) {
     Random random = new Random();
     int otp = 100000 + random.nextInt(900000);
     optCache.put(key, String.valueOf(otp));
     return String.valueOf(otp);
    }

    private String getOtp(String key) {
        try{
            return optCache.get(key);
        }catch (Exception e) {
            return String.valueOf(0);
        }
    }

    private void clearOtp(String key) {
        optCache.invalidate(key);
    }


}


