package com.mjtech.sandaga.service;

import com.mjtech.sandaga.dtos.payment.*;
import com.mjtech.sandaga.entity.EmptyEntity;
import com.mjtech.sandaga.entity.PaymentEntity;
import com.stripe.exception.StripeException;

import java.security.Principal;
import java.util.UUID;

public interface PaymentService {

    PaymentEntity getPaymentById(UUID id);
    PaymentEntity getPaymentByPurchaseId(Long purchaseId);
    PaymentEntity createPayment(PaymentEntity payment);
    PaymentInitResDto getPaymentInitInfo(long purchaseId, Principal principal);

    StripeAuthUserResDto stripeAuth(Principal principal, StripeAuthUserReqDto stripeAuthUserReqDto);

    PaymentDto create(Principal principal, PaymentReqDto paymentReqDto) throws StripeException;

    PaymentListResDto getUserPayment(Principal principal, PaymentPageReqDto paymentPageReqDto);

    PaymentDto chargeCustomer(Principal principal, PaymentChargeReqDto paymentChargeReqDto);

    PaymentDto updateSendPayment(Principal principal, PaymentChargeReqDto paymentChargeReqDto);

    PaymentDto updateReceivePayment(Principal principal, PaymentChargeReqDto paymentChargeReqDto);

    PaymentDto updatePaidPayment(Principal principal, PaymentChargeReqDto paymentChargeReqDto);

    EmptyEntity deletePayment(UUID id);

    PaymentDto cancelPayment(Principal principal, PaymentChargeReqDto paymentChargeReqDto);

    PaymentDto suspendPayment(Principal principal, PaymentChargeReqDto paymentChargeReqDto);

    EmptyEntity refundPayment(Principal principal, PaymentChargeReqDto paymentChargeReqDto);

    EmptyEntity stripeDelete(Principal principal);
}
