package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.auth.UserPublicDataDto;
import com.mjtech.sandaga.dtos.otp.OptVerifyReqDto;
import com.mjtech.sandaga.dtos.otp.PhoneVerifyReqDto;
import com.mjtech.sandaga.dtos.otp.PhoneVerifyResDto;
import com.mjtech.sandaga.service.SmsService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class SmsController {

    private final SmsService smsService;

    public SmsController(SmsService smsService) {
        this.smsService = smsService;
    }


    @ApiOperation(value = "Returns phone verification response", nickname = "sendSms", notes = "Returns verification response", response = PhoneVerifyResDto.class, responseContainer = "PhoneVerifyResDto", tags={ "phone", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = PhoneVerifyResDto.class, responseContainer = "PhoneVerifyResDto") })
    @PostMapping(
            value = "/api/v1/phone/number",
            produces = { "application/json" }
    )
    public ResponseEntity<PhoneVerifyResDto> sendSms(@RequestBody PhoneVerifyReqDto phoneVerifyReqDto) {
        return new ResponseEntity<PhoneVerifyResDto>(smsService.sendSms(phoneVerifyReqDto), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns phone verification response", nickname = "sendSms", notes = "Returns verification response", response = PhoneVerifyResDto.class, responseContainer = "PhoneVerifyResDto", tags={ "phone", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = PhoneVerifyResDto.class, responseContainer = "PhoneVerifyResDto") })
    @PostMapping(
            value = "/api/v1/phone/verify",
            produces = { "application/json" }
    )
    public ResponseEntity<PhoneVerifyResDto> verifyOtp(@RequestBody OptVerifyReqDto optVerifyReqDto) {
        return new ResponseEntity<PhoneVerifyResDto>(smsService.verifySms(optVerifyReqDto), HttpStatus.OK);

    }
}
