package com.mjtech.sandaga.service;

import com.mjtech.sandaga.dtos.otp.OptVerifyReqDto;
import com.mjtech.sandaga.dtos.otp.PhoneVerifyReqDto;
import com.mjtech.sandaga.dtos.otp.PhoneVerifyResDto;

public interface SmsService {
    PhoneVerifyResDto sendSms(PhoneVerifyReqDto phoneVerifyReqDto);

    PhoneVerifyResDto verifySms(OptVerifyReqDto optVerifyReqDto);

}
