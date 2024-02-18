package com.mjtech.sandaga.specifications;

import com.mjtech.sandaga.entity.AdsEntity;
import org.hibernate.spatial.SpatialFunction;
import org.hibernate.spatial.predicate.SpatialPredicates;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.UUID;

public class AdsSpecifications {
    public static Specification<AdsEntity> hasCategory(UUID category) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("category").get("categoryEntity").get("id"), category);
    }

    public static Specification<AdsEntity> hasSubCategory(UUID category) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("category").get("id"), category);
    }

    public static Specification<AdsEntity> hasSubject(String text) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("subject"),"%"+text+"%");
    }

    public static Specification<AdsEntity> hasAdType(String ad_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("ad_type"), ad_type);
    }

    public static Specification<AdsEntity> hasDonation(boolean donation) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("donation"), donation);
    }

    public static Specification<AdsEntity> hasShippingCost(String shipping_cost) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("shipping_cost"), shipping_cost);
    }

    public static Specification<AdsEntity> hasItemCondition(String item_condition) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("item_condition"), item_condition);
    }

    public static Specification<AdsEntity> hasVideo_game_type(String video_game_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("video_game_type"), video_game_type);
    }

    public static Specification<AdsEntity> hasConsole_model(String console_model) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("console_model"), console_model);
    }

    public static Specification<AdsEntity> hasConsole_brand(String console_brand) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("console_brand"), console_brand);
    }

    public static Specification<AdsEntity> hasImage_sound_type_of_product(String image_sound_type_of_product) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("image_sound_type_of_product"), image_sound_type_of_product);
    }

    public static Specification<AdsEntity> hasImage_sound_product(String image_sound_product) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("image_sound_product"), image_sound_product);
    }
    public static Specification<AdsEntity> hasPhone_brand(String phone_brand) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("phone_brand"), phone_brand);
    }
    public static Specification<AdsEntity> hasPhone_color(String phone_color) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("phone_color"), phone_color);
    }

    public static Specification<AdsEntity> hasPhone_model(String phone_model) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("phone_model"), phone_model);
    }

    public static Specification<AdsEntity> hasPhone_memory(String phone_memory) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("phone_memory"), phone_memory);
    }

    public static Specification<AdsEntity> hasFurniture_type(String furniture_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("furniture_type"), furniture_type);
    }

    public static Specification<AdsEntity> hasFurniture_material(String furniture_material) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("furniture_material"), furniture_material);
    }

    public static Specification<AdsEntity> hasFurniture_color(String furniture_color) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("furniture_color"), furniture_color);
    }

    public static Specification<AdsEntity> hasHome_appliance_type(String home_appliance_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("home_appliance_type"), home_appliance_type);
    }

    public static Specification<AdsEntity> hasHome_appliance_product(String home_appliance_product) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("home_appliance_product"), home_appliance_product);
    }

    public static Specification<AdsEntity> hasHome_appliance_brand(String home_appliance_brand) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("home_appliance_brand"), home_appliance_brand);
    }

    public static Specification<AdsEntity> hasTable_art_product(String table_art_product) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("table_art_product"), table_art_product);
    }

    public static Specification<AdsEntity> hasTable_art_material(String table_art_material) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("table_art_material"), table_art_material);
    }

    public static Specification<AdsEntity> hasDecoration_type(String decoration_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("decoration_type"), decoration_type);
    }

    public static Specification<AdsEntity> hasLinens_type(String linens_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("linens_type"), linens_type);
    }

    public static Specification<AdsEntity> hasLinens_product(String linens_product) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("linens_product"), linens_product);
    }

    public static Specification<AdsEntity> hasLinens_material(String linens_material) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("linens_material"), linens_material);
    }

    public static Specification<AdsEntity> hasDiy_type(String diy_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("diy_type"), diy_type);
    }

    public static Specification<AdsEntity> hasDiy_product(String diy_product) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("diy_product"), diy_product);
    }

    public static Specification<AdsEntity> hasGardening_type(String gardening_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("gardening_type"), gardening_type);
    }
    public static Specification<AdsEntity> hasGardening_product(String gardening_product) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("gardening_product"), gardening_product);
    }

    public static Specification<AdsEntity> hasClothing_type(String clothing_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("clothing_type"), clothing_type);
    }
    public static Specification<AdsEntity> hasClothing_st(String clothing_st) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("clothing_st"), clothing_st);
    }

    public static Specification<AdsEntity> hasClothing_category(String clothing_category) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("clothing_category"), clothing_category);
    }

    public static Specification<AdsEntity> hasClothing_brand(String clothing_brand) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("clothing_brand"), clothing_brand);
    }
    public static Specification<AdsEntity> hasClothing_color(String clothing_color) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("clothing_color"), clothing_color);
    }

    public static Specification<AdsEntity> hasClothing_condition(String clothing_condition) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("clothing_condition"), clothing_condition);
    }

    public static Specification<AdsEntity> hasShoe_type(String shoe_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("shoe_type"), shoe_type);
    }

    public static Specification<AdsEntity> haSshoe_category(String shoe_category) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("shoe_category"), shoe_category);
    }

    public static Specification<AdsEntity> hasShoe_size(String shoe_size) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("shoe_size"), shoe_size);
    }
    public static Specification<AdsEntity> hasShoe_brand(String shoe_brand) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("shoe_brand"), shoe_brand);
    }

    public static Specification<AdsEntity> hasAccessories_univers(String accessories_univers) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("item_condition"), accessories_univers);
    }
    public static Specification<AdsEntity> hasAccessories_type(String accessories_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("accessories_type"), accessories_type);
    }
    public static Specification<AdsEntity> hasAccessories_brand(String accessories_brand) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("accessories_brand"), accessories_brand);
    }
    public static Specification<AdsEntity> hasAccessories_material(String accessories_material) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("accessories_material"), accessories_material);
    }

    public static Specification<AdsEntity> hasWatches_jewels_brand(String watches_jewels_brand) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("watches_jewels_brand"), watches_jewels_brand);
    }
    public static Specification<AdsEntity> hasWatches_jewels_type(String watches_jewels_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("watches_jewels_type"), watches_jewels_type);
    }
    public static Specification<AdsEntity> hasWatches_jewels_material(String watches_jewels_material) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("watches_jewels_material"), watches_jewels_material);
    }
    public static Specification<AdsEntity> hasBaby_equipment_type(String baby_equipment_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("baby_equipment_type"), baby_equipment_type);
    }
    public static Specification<AdsEntity> hasBaby_equipment_brand(String baby_equipment_brand) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("baby_equipment_brand"), baby_equipment_brand);
    }
    public static Specification<AdsEntity> hasBaby_clothing_category(String baby_clothing_category) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("baby_clothing_category"), baby_clothing_category);
    }
    public static Specification<AdsEntity> hasBaby_clothing_brand(String baby_clothing_brand) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("baby_clothing_brand"), baby_clothing_brand);
    }
    public static Specification<AdsEntity> hasBaby_age(String baby_age) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("baby_age"), baby_age);
    }

    public static Specification<AdsEntity> hasBicycle_size(String bicycle_size) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("bicycle_size"), bicycle_size);
    }

    public static Specification<AdsEntity> hasBicycle_type(String bicycle_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("bicycle_type"), bicycle_type);
    }

    public static Specification<AdsEntity> hasSports_hobbies_activity(String sports_hobbies_activity) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("sports_hobbies_activity"), sports_hobbies_activity);
    }
    public static Specification<AdsEntity> hasToy_age(String toy_age) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("toy_age"), toy_age);
    }
    public static Specification<AdsEntity> hasToy_type(String toy_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("toy_type"), toy_type);
    }

    public static Specification<AdsEntity> hasMatpro_agriculture_equipment_type(String matpro_agriculture_equipment_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("matpro_agriculture_equipment_type"), matpro_agriculture_equipment_type);
    }

    public static Specification<AdsEntity> hasMatpro_transport_handling_equipment_type(String matpro_transport_handling_equipment_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("matpro_transport_handling_equipment_type"), matpro_transport_handling_equipment_type);
    }

    public static Specification<AdsEntity> hasMatpro_btp_equipment_type(String matpro_btp_equipment_type) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("matpro_btp_equipment_type"), matpro_btp_equipment_type);
    }

    public static Specification<AdsEntity> hasRegdate(String regdate) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("criteria").get("regdate"), regdate);
    }

    public static Specification<AdsEntity> hasMin(double min) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("price_cents"), min);
    }

    public static Specification<AdsEntity> hasMax(double max) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("price_cents"), max);
    }

    public static Specification<AdsEntity> hasPrice(double min, double max) {

        return (root, query, criteriaBuilder) -> criteriaBuilder.and(

                criteriaBuilder.greaterThanOrEqualTo(root.get("price_cents"), min),

                criteriaBuilder.lessThanOrEqualTo(root.get("price_cents"), max)

        );
    }

    public static Specification<AdsEntity> hasLocation(double lng, double lat, int radius) {
        return new Specification<AdsEntity>() {
            @Override
            public Predicate toPredicate(Root<AdsEntity> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

                GeometryFactory factory  = new GeometryFactory();
                Point comparisonPoint = factory.createPoint(new Coordinate(lat, lng));

                return SpatialPredicates.distanceWithin(builder, root.get("location"), comparisonPoint, radius);
            }
        };
    }

    public static Specification<AdsEntity> filterWithInRadius(double longitute, double latitude, double radius) {
        return (root,query,builder)-> {

            Expression<Geometry> geography = builder.function("geography", Geometry.class, root.get("location"));
            Expression<Point> point = builder.function("ST_Point", Point.class, builder.literal(longitute),
                    builder.literal(latitude));
            Expression<Point> comparisonpoint = builder.function("ST_SetSRID", Point.class, point,
                    builder.literal(4326));
            Expression<Boolean> expression = builder.function(SpatialFunction.dwithin.toString(), boolean.class,
                    geography, comparisonpoint, builder.literal(radius));
            System.out.println(radius);
            return builder.equal(expression, true);
        };
    }


    public static Specification<AdsEntity> hasOrderBy(Specification<AdsEntity> spec, String sort, String order) {
        return (root, query, builder) -> {

            if (sort.equals("price") && order.equals("asc")) {
                query.orderBy(builder.asc(root.get("price_cents")));
            } else if(sort.equals("price") && order.equals("desc")){
                query.orderBy(builder.desc(root.get("price_cents")));
            } else if(sort.equals("time") && order.equals("asc")){
                query.orderBy(builder.asc(root.get("createdAt")));
            } else {
                query.orderBy(builder.desc(root.get("createdAt")));
            }
            return spec.toPredicate(root, query, builder);
        };
    }
}
