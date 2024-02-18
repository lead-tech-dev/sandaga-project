package com.mjtech.sandaga.dtos.payment;

import com.mjtech.sandaga.dtos.favoite.FavoritesDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentListResDto {

    private int totalPages;
    private long totalItems;
    List<PaymentDto> payments;
}
