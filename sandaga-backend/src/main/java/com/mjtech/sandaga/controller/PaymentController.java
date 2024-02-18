package com.mjtech.sandaga.controller;

import com.mjtech.sandaga.dtos.payment.*;
import com.mjtech.sandaga.entity.EmptyEntity;
import com.mjtech.sandaga.service.PaymentService;
import com.stripe.exception.StripeException;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.UUID;

@RestController
public class PaymentController {
    private final PaymentService paymentService;
    public PaymentController(PaymentService paymentService) {
       this.paymentService = paymentService;
    }

    @ApiOperation(value = "Returns init payment info", nickname = "getPaymentInitInfo", notes = "Returns init payment info", response = PaymentInitResDto.class, responseContainer = "PaymentInitResDto", tags={ "payment", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = PaymentInitResDto.class, responseContainer = "PaymentInitResDto") })
    @GetMapping(
            value = "/api/v1/payment/purchases/{purchaseId}",
            produces = { "application/json" }
    )
    public ResponseEntity<PaymentInitResDto> getPaymentInitInfo(@Valid @PathVariable long purchaseId, Principal principal) {
        return new ResponseEntity<PaymentInitResDto>(paymentService.getPaymentInitInfo(purchaseId, principal), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns stripe auth user", nickname = "stripeAuth", notes = "Returns stripe auth user", response = StripeAuthUserResDto.class, responseContainer = "PaymentInitResDto", tags={ "payment", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = StripeAuthUserResDto.class, responseContainer = "StripeAuthUserDto") })
    @PutMapping(
            value = "/api/v1/payment/stripe_auth",
            produces = { "application/json" }
    )
    public ResponseEntity<StripeAuthUserResDto> stripeAuth(Principal principal, @RequestBody StripeAuthUserReqDto stripeAuthUserReqDto) {
        return new ResponseEntity<StripeAuthUserResDto>(paymentService.stripeAuth(principal, stripeAuthUserReqDto), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns stripe delete user", nickname = "stripeAuth", notes = "Returns stripe delete user", response = EmptyEntity.class, responseContainer = "PaymentInitResDto", tags={ "payment", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
    @PutMapping(
            value = "/api/v1/payment/stripe_delete",
            produces = { "application/json" }
    )
    public ResponseEntity<EmptyEntity> stripeDelete(Principal principal) {
        return new ResponseEntity<EmptyEntity>(paymentService.stripeDelete(principal), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns created payment", nickname = "create", notes = "Returns created payment", response = PaymentDto.class, responseContainer = "PaymentResDto", tags={ "payment", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = PaymentDto.class, responseContainer = "PaymentResDto") })
    @PostMapping(
            value = "/api/v1/payment",
            produces = { "application/json" }
    )
    public ResponseEntity<PaymentDto> create(Principal principal, @RequestBody PaymentReqDto paymentReqDto) throws StripeException {
        return new ResponseEntity<PaymentDto>(paymentService.create(principal, paymentReqDto), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns user list payment", nickname = "create", notes = "Returns user list payment", response = PaymentDto.class, responseContainer = "PaymentResDto", tags={ "payment", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = PaymentDto.class, responseContainer = "PaymentResDto") })
    @PostMapping(
            value = "/api/v1/payment/list",
            produces = { "application/json" }
    )
    public ResponseEntity<PaymentListResDto> getUserPayment(Principal principal, @RequestBody PaymentPageReqDto paymentPageReqDto)  {
        return new ResponseEntity<PaymentListResDto>(paymentService.getUserPayment(principal, paymentPageReqDto), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns customer charge details", nickname = "chargeCustomer", notes = "Returns customer charge details", response = PaymentResDto.class, responseContainer = "PaymentChargeResDto", tags={ "payment", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = PaymentResDto.class, responseContainer = "PaymentChargeResDto") })
    @PutMapping(
            value = "/api/v1/payment/charge",
            produces = { "application/json" }
    )
    public ResponseEntity<PaymentDto> chargeCustomer(Principal principal, @RequestBody PaymentChargeReqDto paymentChargeReqDto)  {
        return new ResponseEntity<>(paymentService.chargeCustomer(principal, paymentChargeReqDto), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns update payment", nickname = "updateSendPayment", notes = "Returns update payment", response = PaymentDto.class, responseContainer = "PaymentDto", tags={ "payment", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = PaymentDto.class, responseContainer = "PaymentDto") })
    @PutMapping(
            value = "/api/v1/payment/send",
            produces = { "application/json" }
    )
    public ResponseEntity<PaymentDto> updateSendPayment(Principal principal, @RequestBody PaymentChargeReqDto paymentChargeReqDto)  {
        return new ResponseEntity<>(paymentService.updateSendPayment(principal, paymentChargeReqDto), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns update payment", nickname = "updateReceivePayment", notes = "Returns update payment", response = PaymentDto.class, responseContainer = "PaymentDto", tags={ "payment", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = PaymentDto.class, responseContainer = "PaymentDto") })
    @PutMapping(
            value = "/api/v1/payment/receive",
            produces = { "application/json" }
    )
    public ResponseEntity<PaymentDto> updateReceivePayment(Principal principal, @RequestBody PaymentChargeReqDto paymentChargeReqDto)  {
        return new ResponseEntity<>(paymentService.updateReceivePayment(principal, paymentChargeReqDto), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns update payment", nickname = "updatePaidPayment", notes = "Returns update payment", response = PaymentDto.class, responseContainer = "PaymentDto", tags={ "payment", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = PaymentDto.class, responseContainer = "PaymentDto") })
    @PutMapping(
            value = "/api/v1/payment/paid",
            produces = { "application/json" }
    )
    public ResponseEntity<PaymentDto> updatePaidPayment(Principal principal, @RequestBody PaymentChargeReqDto paymentChargeReqDto)  {
        return new ResponseEntity<>(paymentService.updatePaidPayment(principal, paymentChargeReqDto), HttpStatus.OK);

    }

    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = PaymentDto.class, responseContainer = "PaymentDto") })
    @PutMapping(
            value = "/api/v1/payment/cancel",
            produces = { "application/json" }
    )
    public ResponseEntity<PaymentDto> cancelPayment(Principal principal, @RequestBody PaymentChargeReqDto paymentChargeReqDto)  {
        return new ResponseEntity<>(paymentService.cancelPayment(principal, paymentChargeReqDto), HttpStatus.OK);

    }

    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = PaymentDto.class, responseContainer = "PaymentDto") })
    @PutMapping(
            value = "/api/v1/payment/suspend",
            produces = { "application/json" }
    )
    public ResponseEntity<PaymentDto> suspendPayment(Principal principal, @RequestBody PaymentChargeReqDto paymentChargeReqDto)  {
        return new ResponseEntity<>(paymentService.suspendPayment(principal, paymentChargeReqDto), HttpStatus.OK);

    }

    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
    @PutMapping(
            value = "/api/v1/payment/refund",
            produces = { "application/json" }
    )
    public ResponseEntity<EmptyEntity> refundPayment(Principal principal, @RequestBody PaymentChargeReqDto paymentChargeReqDto)  {
        return new ResponseEntity<>(paymentService.refundPayment(principal, paymentChargeReqDto), HttpStatus.OK);

    }

    @ApiOperation(value = "Returns no content", nickname = "deletePayment", notes = "Returns no content", response = EmptyEntity.class, responseContainer = "EmptyEntity", tags={ "payment", })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "For successful fetch.", response = EmptyEntity.class, responseContainer = "EmptyEntity") })
    @PutMapping(
            value = "/api/v1/payment/{id}",
            produces = { "application/json" }
    )
    public ResponseEntity<EmptyEntity> deletePayment(@PathVariable String id)  {
        return new ResponseEntity<>(paymentService.deletePayment(UUID.fromString(id)), HttpStatus.OK);

    }

}
