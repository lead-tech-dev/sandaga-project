package com.mjtech.sandaga.dtos.payment;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mjtech.sandaga.dtos.address.AddressDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryModesDto {
   private DisplayDto display;
   @JsonInclude(JsonInclude.Include.NON_NULL)
   private FaceToFaceDto face_to_face;
   @JsonInclude(JsonInclude.Include.NON_NULL)
   private MondialRelayDto mondial_relay;
   @JsonInclude(JsonInclude.Include.NON_NULL)
   private CourrierSuiviDto courrier_suivi;
}
