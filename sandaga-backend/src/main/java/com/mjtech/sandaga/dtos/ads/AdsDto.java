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
import com.mjtech.sandaga.entity.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
//@JsonIgnoreProperties({"category", "user"})
public class AdsDto {
    private String id;
    private String ad_type;
    private String subject;
    private String body;

    private String email;
    private String phone;
    private Timestamp createdAt;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private boolean donation;

    private double price_cents;

    private long purchaseId;
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private double price_reco;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String shipping_type;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String shipping_cost;
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private boolean phone_hidden_information_text;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private CriteriaDto criteria;
    private List<ImageDto> images;

    private AddressDto address;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private PointDto point;


    @JsonSerialize(using = GeometrySerializer.class)
    @JsonDeserialize(contentUsing = GeometryDeserializer.class)
    private Point location;

    private UserDto user;

    private String status;

    private SubcategoryDto category;
}
