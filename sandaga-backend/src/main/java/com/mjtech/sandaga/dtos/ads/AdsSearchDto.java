package com.mjtech.sandaga.dtos.ads;

import com.bedatadriven.jackson.datatype.jts.serialization.GeometryDeserializer;
import com.bedatadriven.jackson.datatype.jts.serialization.GeometrySerializer;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.auth.UserDto;
import com.mjtech.sandaga.dtos.categories.SubcategoryDto;
import com.mjtech.sandaga.dtos.criteria.CriteriaDto;
import com.mjtech.sandaga.dtos.image.ImageDto;
import com.mjtech.sandaga.dtos.point.PointDto;
import com.mjtech.sandaga.enums.ads.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Point;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdsSearchDto {
    private String id;
    private String subject;
    private Timestamp createdAt;
    private double price_cents;
    private String imageName;
    private int imageCount;
    private String pincode;
    private String city;

    private String category;

    @Enumerated(EnumType.STRING)
    private Status status;

    private StatsAdsDto stats;
}
