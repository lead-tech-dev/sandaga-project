package com.mjtech.sandaga.utility.dto;

import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.message.MessageDto;
import com.mjtech.sandaga.dtos.payment.*;
import com.mjtech.sandaga.dtos.shipping.ShippingDto;
import com.mjtech.sandaga.entity.MessageEntity;
import com.mjtech.sandaga.entity.PaymentEntity;
import com.mjtech.sandaga.entity.ShippingEntity;
import com.mjtech.sandaga.entity.ShippingStepEntity;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Payment {

    public static PaymentDto toDto(PaymentEntity entity) {
        String imageName = null;
        if (Image.toDtoList(entity.getAds().getImages()).size() != 0) {
            imageName = Image.toDtoList(entity.getAds().getImages()).get(0).getName();
        }

        BuyerDto buyer = null;
        if (entity.getBuyer() != null) {
            buyer = BuyerDto.builder()
                    .id(String.valueOf(entity.getBuyer().getId()))
                    .first_name(entity.getBuyer().getFirstName())
                    .last_name(entity.getBuyer().getLastName())
                    .phone_number(entity.getBuyer().getPhone())
                    .build();
        }


        return PaymentDto.builder()
                .id(String.valueOf(entity.getId()))
                .paymentId(entity.getPaymentId())
                .purchaseId(String.valueOf(entity.getPurchaseId()))
                .delivery_mode(entity.getDelivery_mode())
                .ads(ItemDto.builder()
                        .id(String.valueOf(entity.getAds().getId()))
                        .title(entity.getAds().getSubject())
                        .imageUrl(imageName)
                        .prices(PricesDto.builder()
                                .price((int) (entity.getAds().getPrice_cents() * 100))
                                .build())
                        .build())
                .amount(entity.getAmount())
                .status(entity.getStatus())
                .labelUrl(entity.getLabelUrl())
                .createdAt(entity.getCreatedAt())
                .buyer(buyer)
                .seller(SellerDto.builder()
                        .id(String.valueOf(entity.getSeller().getId()))
                        .name(entity.getSeller().getFirstName())
                        .build())
                .shippingStep(ShippingStep.toDtoList(entity.getSteps()))
                .shippingAddress(ShippingDto.builder()
                        .street(entity.getShipping().getAddress())
                        .pincode(entity.getShipping().getPincode())
                        .city(entity.getShipping().getCity())
                        .build())
                .build();
    }

    public static List<PaymentDto> toPaymentDtoList(List<PaymentEntity> payments) {
        if (Objects.isNull(payments)) {
            return Collections.emptyList();
        }
        return payments.stream().map(Payment::toDto).collect(Collectors.toList());
    }


}
