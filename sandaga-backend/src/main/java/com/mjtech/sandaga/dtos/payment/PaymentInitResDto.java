package com.mjtech.sandaga.dtos.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInitResDto {
    private long id;
    private ItemDto item;
    private BuyerDto buyer;
    private SellerDto seller;
    private DeliveryModesDto delivery_modes;
}
