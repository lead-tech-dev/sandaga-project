package com.mjtech.sandaga.service.impl;

import com.bedatadriven.jackson.datatype.jts.JtsModule;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mjtech.sandaga.dtos.search.AdsSearchReqDto;
import com.mjtech.sandaga.dtos.search.AdsSearchResDto;
import com.mjtech.sandaga.dtos.search.AdsSuggestionsResDto;
import com.mjtech.sandaga.entity.*;
import com.mjtech.sandaga.enums.ads.Status;
import com.mjtech.sandaga.enums.payment.PaymentStatus;
import com.mjtech.sandaga.exception.ResourceNotFoundException;
import com.mjtech.sandaga.dtos.ads.*;
import com.mjtech.sandaga.repository.*;
import com.mjtech.sandaga.service.*;
import com.mjtech.sandaga.specifications.AdsSpecifications;
import com.mjtech.sandaga.utility.Utility;
import com.mjtech.sandaga.utility.dto.*;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.locationtech.jts.geom.Point;

import javax.transaction.Transactional;
import java.security.Principal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;


@Service
public class AdsServiceImpl implements AdsService {
    private final AdsRepository adsRepository;

    private final SubcategoryService subcategoryService;

    private final CategoryService categoryService;

    private final AddressService addressService;

    private final UserService userService;

    private final CriteriaService criteriaService;

    private final PointRepository pointService;

    private final PaymentService paymentService;

    private final ImageService imageService;

    private GeometryFactory factory = new GeometryFactory(new PrecisionModel(), 4326);

    public AdsServiceImpl(AdsRepository adsRepository, SubcategoryService subcategoryService, CategoryService categoryService, AddressService addressService, UserService userService, CriteriaService criteriaService, PointRepository pointService, PaymentService paymentService, ImageService imageService) {

        this.adsRepository = adsRepository;
        this.subcategoryService = subcategoryService;this.categoryService = categoryService;
        this.addressService = addressService;
        this.userService = userService;
        this.criteriaService = criteriaService;
        this.pointService = pointService;
    this.paymentService = paymentService;
        this.imageService = imageService;
    }

    @Override
    public Iterable<AdsEntity> getAds() {
        return adsRepository.findAll();
    }

    @Override
    public AdsEntity getAdsById(String id) {
        Optional<AdsEntity> existsAds = adsRepository.findById(UUID.fromString(id));

        if (existsAds.isEmpty()) {
            throw new ResourceNotFoundException("Ads not found!");
        }
         return existsAds.get();
    }

    @Override
    public AdsEntity saveAds(AdsEntity adsEntity) {
        return adsRepository.save(adsEntity);
    }

    @Override
    public AdsEntity addAds(Principal principal, AdsReqDto adsReq) {
        CriteriaEntity criteria = null;
        SubcategoryEntity category = subcategoryService.getSubcategoryByID(adsReq.getCategoryId());
        UserEntity user = userService.findUserByEmail(principal.getName());


        AddressEntity address = addressService.createAddress(adsReq.getAddress());


        if (Objects.nonNull(adsReq.getCriteria())){
             criteria = criteriaService.addCriteria(adsReq.getCriteria());
        }


        Point point = factory.createPoint(
                new Coordinate(
                        adsReq.getPoint().getLongitude(),
                        adsReq.getPoint().getLatitude()
                )
        );

        PointEntity pointEntity = pointService.save(new PointEntity());
        int purchaseId = 133 + Utility.generateDigits();

        PaymentEntity paymentEntity = paymentService.createPayment(PaymentEntity.builder()
                        .purchaseId(purchaseId)
                        .seller(user)
                        .status(PaymentStatus.init)
                .build());

        AdsEntity ads = Ads.toEntity(adsReq);
        ads.setStatus(Status.active);
        ads.setPoint(pointEntity);
        ads.setUser(user);
        ads.setAddress(address);
        ads.setCategory(category);
        ads.setLocation(point);
        ads.setCriteria(criteria);
        ads.setPayment(paymentEntity);
        ads.setCreatedAt(Timestamp.from(Instant.now()));

        return adsRepository.save(ads);
    }


    @Override
    public AdsSearchResDto searchAds(AdsSearchReqDto adsSearchReqDto) {
        Specification<AdsEntity> spec = Specification.where(null);

        if (adsSearchReqDto.getFilters().getCategory() != null && !adsSearchReqDto.getFilters().getCategory().isEmpty()) {

            Optional<CategoryEntity> category = categoryService.getCategory(adsSearchReqDto.getFilters().getCategory());

            if (category.isPresent()) {
                spec = spec.and(AdsSpecifications.hasCategory(UUID.fromString(adsSearchReqDto.getFilters().getCategory())));
            }else {
                spec = spec.and(AdsSpecifications.hasSubCategory(UUID.fromString(adsSearchReqDto.getFilters().getCategory())));

            }
        }

        if (adsSearchReqDto.getFilters().getKeywords() != null && !adsSearchReqDto.getFilters().getKeywords().getText().isEmpty()) {
            spec = spec.and(AdsSpecifications.hasSubject(adsSearchReqDto.getFilters().getKeywords().getText()));
        }

        spec = spec.and(AdsSpecifications.hasAdType(adsSearchReqDto.getFilters().getCriteria().getAd_type()));

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getDonation() != null) {
            spec = spec.and(AdsSpecifications.hasDonation(Boolean.parseBoolean(adsSearchReqDto.getFilters().getCriteria().getDonation())));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getShipping_cost() != null) {
            spec = spec.and(AdsSpecifications.hasShippingCost(adsSearchReqDto.getFilters().getCriteria().getShipping_cost()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getItem_condition() != null) {
            spec = spec.and(AdsSpecifications.hasItemCondition(adsSearchReqDto.getFilters().getCriteria().getItem_condition()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getVideo_game_type() != null) {
            spec = spec.and(AdsSpecifications.hasVideo_game_type(adsSearchReqDto.getFilters().getCriteria().getVideo_game_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getConsole_model() != null) {
            spec = spec.and(AdsSpecifications.hasConsole_model(adsSearchReqDto.getFilters().getCriteria().getConsole_model()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getConsole_brand() != null) {
            spec = spec.and(AdsSpecifications.hasConsole_brand(adsSearchReqDto.getFilters().getCriteria().getConsole_brand()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getImage_sound_type_of_product() != null) {
            spec = spec.and(AdsSpecifications.hasImage_sound_type_of_product(adsSearchReqDto.getFilters().getCriteria().getImage_sound_type_of_product()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getImage_sound_product() != null) {
            spec = spec.and(AdsSpecifications.hasImage_sound_product(adsSearchReqDto.getFilters().getCriteria().getImage_sound_product()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getPhone_brand() != null) {
            spec = spec.and(AdsSpecifications.hasPhone_brand(adsSearchReqDto.getFilters().getCriteria().getPhone_brand()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getPhone_color() != null) {
            spec = spec.and(AdsSpecifications.hasPhone_color(adsSearchReqDto.getFilters().getCriteria().getPhone_color()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getPhone_model() != null) {
            spec = spec.and(AdsSpecifications.hasPhone_model(adsSearchReqDto.getFilters().getCriteria().getPhone_model()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getPhone_memory() != null) {
            spec = spec.and(AdsSpecifications.hasPhone_memory(adsSearchReqDto.getFilters().getCriteria().getPhone_memory()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getFurniture_type() != null) {
            spec = spec.and(AdsSpecifications.hasFurniture_type(adsSearchReqDto.getFilters().getCriteria().getFurniture_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getFurniture_material() != null) {
            spec = spec.and(AdsSpecifications.hasFurniture_material(adsSearchReqDto.getFilters().getCriteria().getFurniture_material()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getFurniture_color() != null) {
            spec = spec.and(AdsSpecifications.hasFurniture_color(adsSearchReqDto.getFilters().getCriteria().getFurniture_color()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getHome_appliance_type() != null) {
            spec = spec.and(AdsSpecifications.hasHome_appliance_type(adsSearchReqDto.getFilters().getCriteria().getHome_appliance_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getHome_appliance_product() != null) {
            spec = spec.and(AdsSpecifications.hasHome_appliance_product(adsSearchReqDto.getFilters().getCriteria().getHome_appliance_product()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getHome_appliance_brand() != null) {
            spec = spec.and(AdsSpecifications.hasHome_appliance_brand(adsSearchReqDto.getFilters().getCriteria().getHome_appliance_brand()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getTable_art_product() != null) {
            spec = spec.and(AdsSpecifications.hasTable_art_product(adsSearchReqDto.getFilters().getCriteria().getTable_art_product()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getTable_art_material() != null) {
            spec = spec.and(AdsSpecifications.hasTable_art_material(adsSearchReqDto.getFilters().getCriteria().getTable_art_material()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getDecoration_type() != null) {
            spec = spec.and(AdsSpecifications.hasDecoration_type(adsSearchReqDto.getFilters().getCriteria().getDecoration_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getLinens_type() != null) {
            spec = spec.and(AdsSpecifications.hasLinens_type(adsSearchReqDto.getFilters().getCriteria().getLinens_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getLinens_product() != null) {
            spec = spec.and(AdsSpecifications.hasLinens_product(adsSearchReqDto.getFilters().getCriteria().getLinens_product()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getLinens_material() != null) {
            spec = spec.and(AdsSpecifications.hasLinens_material(adsSearchReqDto.getFilters().getCriteria().getLinens_material()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getDiy_type() != null) {
            spec = spec.and(AdsSpecifications.hasDiy_type(adsSearchReqDto.getFilters().getCriteria().getDiy_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getDiy_product() != null) {
            spec = spec.and(AdsSpecifications.hasDiy_product(adsSearchReqDto.getFilters().getCriteria().getDiy_product()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getGardening_type() != null) {
            spec = spec.and(AdsSpecifications.hasGardening_type(adsSearchReqDto.getFilters().getCriteria().getGardening_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getGardening_product() != null) {
            spec = spec.and(AdsSpecifications.hasGardening_product(adsSearchReqDto.getFilters().getCriteria().getGardening_product()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getClothing_type() != null) {
            spec = spec.and(AdsSpecifications.hasClothing_type(adsSearchReqDto.getFilters().getCriteria().getClothing_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getClothing_st() != null) {
            spec = spec.and(AdsSpecifications.hasClothing_st(adsSearchReqDto.getFilters().getCriteria().getClothing_st()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getClothing_category() != null) {
            spec = spec.and(AdsSpecifications.hasClothing_category(adsSearchReqDto.getFilters().getCriteria().getClothing_category()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getClothing_brand() != null) {
            spec = spec.and(AdsSpecifications.hasClothing_brand(adsSearchReqDto.getFilters().getCriteria().getClothing_brand()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getClothing_color() != null) {
            spec = spec.and(AdsSpecifications.hasClothing_color(adsSearchReqDto.getFilters().getCriteria().getClothing_color()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getClothing_condition() != null) {
            spec = spec.and(AdsSpecifications.hasClothing_condition(adsSearchReqDto.getFilters().getCriteria().getClothing_condition()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getShoe_type() != null) {
            spec = spec.and(AdsSpecifications.hasShoe_type(adsSearchReqDto.getFilters().getCriteria().getShoe_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getShoe_category() != null) {
            spec = spec.and(AdsSpecifications.haSshoe_category(adsSearchReqDto.getFilters().getCriteria().getShoe_category()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getShoe_size() != null) {
            spec = spec.and(AdsSpecifications.hasShoe_size(adsSearchReqDto.getFilters().getCriteria().getShoe_size()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getShoe_brand() != null) {
            spec = spec.and(AdsSpecifications.hasShoe_brand(adsSearchReqDto.getFilters().getCriteria().getShoe_brand()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getAccessories_univers() != null) {
            spec = spec.and(AdsSpecifications.hasAccessories_univers(adsSearchReqDto.getFilters().getCriteria().getAccessories_univers()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getAccessories_type() != null) {
            spec = spec.and(AdsSpecifications.hasAccessories_type(adsSearchReqDto.getFilters().getCriteria().getAccessories_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getAccessories_brand() != null) {
            spec = spec.and(AdsSpecifications.hasAccessories_brand(adsSearchReqDto.getFilters().getCriteria().getAccessories_brand()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getAccessories_material() != null) {
            spec = spec.and(AdsSpecifications.hasAccessories_material(adsSearchReqDto.getFilters().getCriteria().getAccessories_material()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getWatches_jewels_brand() != null) {
            spec = spec.and(AdsSpecifications.hasWatches_jewels_brand(adsSearchReqDto.getFilters().getCriteria().getWatches_jewels_brand()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getWatches_jewels_type() != null) {
            spec = spec.and(AdsSpecifications.hasWatches_jewels_type(adsSearchReqDto.getFilters().getCriteria().getWatches_jewels_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getWatches_jewels_material() != null) {
            spec = spec.and(AdsSpecifications.hasWatches_jewels_material(adsSearchReqDto.getFilters().getCriteria().getWatches_jewels_material()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getBaby_equipment_type() != null) {
            spec = spec.and(AdsSpecifications.hasBaby_equipment_type(adsSearchReqDto.getFilters().getCriteria().getBaby_equipment_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getBaby_equipment_brand() != null) {
            spec = spec.and(AdsSpecifications.hasBaby_equipment_brand(adsSearchReqDto.getFilters().getCriteria().getBaby_equipment_brand()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getBaby_clothing_category() != null) {
            spec = spec.and(AdsSpecifications.hasBaby_clothing_category(adsSearchReqDto.getFilters().getCriteria().getBaby_clothing_category()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getBaby_clothing_brand() != null) {
            spec = spec.and(AdsSpecifications.hasBaby_clothing_brand(adsSearchReqDto.getFilters().getCriteria().getBaby_clothing_brand()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getBaby_age()  != null) {
            spec = spec.and(AdsSpecifications.hasBaby_age(adsSearchReqDto.getFilters().getCriteria().getBaby_age()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getBicycle_type() != null) {
            spec = spec.and(AdsSpecifications.hasBicycle_type(adsSearchReqDto.getFilters().getCriteria().getBicycle_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getBicycle_size() != null) {
            spec = spec.and(AdsSpecifications.hasBicycle_size(adsSearchReqDto.getFilters().getCriteria().getBicycle_size()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getSports_hobbies_activity() != null) {
            spec = spec.and(AdsSpecifications.hasSports_hobbies_activity(adsSearchReqDto.getFilters().getCriteria().getSports_hobbies_activity()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getToy_age() != null) {
            spec = spec.and(AdsSpecifications.hasToy_age(adsSearchReqDto.getFilters().getCriteria().getToy_age()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getToy_type() != null) {
            spec = spec.and(AdsSpecifications.hasToy_type(adsSearchReqDto.getFilters().getCriteria().getToy_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getMatpro_agriculture_equipment_type() != null) {
            spec = spec.and(AdsSpecifications.hasMatpro_agriculture_equipment_type(adsSearchReqDto.getFilters().getCriteria().getMatpro_agriculture_equipment_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getMatpro_transport_handling_equipment_type() != null) {
            spec = spec.and(AdsSpecifications.hasMatpro_transport_handling_equipment_type(adsSearchReqDto.getFilters().getCriteria().getMatpro_transport_handling_equipment_type()));
        }
        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getMatpro_btp_equipment_type() != null) {
            spec = spec.and(AdsSpecifications.hasMatpro_btp_equipment_type(adsSearchReqDto.getFilters().getCriteria().getMatpro_btp_equipment_type()));
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getRegdate() != null) {
            spec = spec.and(AdsSpecifications.hasRegdate(adsSearchReqDto.getFilters().getCriteria().getRegdate()));
        }

        if (adsSearchReqDto.getFilters().getRanges() != null ) {
            if (adsSearchReqDto.getFilters().getRanges().getPrice().getMin() != 0 && adsSearchReqDto.getFilters().getRanges().getPrice().getMax() == 0) {
                spec = spec.and(AdsSpecifications.hasMin(adsSearchReqDto.getFilters().getRanges().getPrice().getMin()));

            }else if (adsSearchReqDto.getFilters().getRanges().getPrice().getMax() != 0 && adsSearchReqDto.getFilters().getRanges().getPrice().getMin() == 0) {
                spec = spec.and(AdsSpecifications.hasMax(adsSearchReqDto.getFilters().getRanges().getPrice().getMax()));

            }
            else if (adsSearchReqDto.getFilters().getRanges().getPrice().getMax() != 0 && adsSearchReqDto.getFilters().getRanges().getPrice().getMin() != 0) {
                spec = spec.and(AdsSpecifications.hasPrice(
                        adsSearchReqDto.getFilters().getRanges().getPrice().getMin(),
                        adsSearchReqDto.getFilters().getRanges().getPrice().getMax()
                        )
                );

            }
         }


        if (adsSearchReqDto.getFilters().getLocation() != null) {
            spec = spec.and(AdsSpecifications.filterWithInRadius(adsSearchReqDto.getFilters().getLocation().getPoint().getLng(), adsSearchReqDto.getFilters().getLocation().getPoint().getLat(), adsSearchReqDto.getFilters().getLocation().getPoint().getRadius() * 1000));
        }


        spec = spec.and(AdsSpecifications.hasOrderBy(spec, adsSearchReqDto.getSort(), adsSearchReqDto.getOrder()));


        Pageable pageable = PageRequest.of(adsSearchReqDto.getCurrentPage() - 1, adsSearchReqDto.getLimit());

        Page<AdsEntity> page = adsRepository.findAll(spec, pageable);


        return AdsSearchResDto.builder()
                .totalPages(page.getTotalPages())
                .totalItems(page.getTotalElements())
                .ads(Ads.toSearchDtoList(page.getContent()))
                .build();
    }

   @Override
   public AdsEntity updateAds(Principal principal, String id, AdsUpdateReqDto adsUpdateReqDto) {
       ObjectMapper mapper = new ObjectMapper();
       mapper.registerModule(new JtsModule());
       UserEntity user = userService.findUserByEmail(principal.getName());

        Optional<AdsEntity> existsAds = adsRepository.findAdsEntityByIdAndUserId(UUID.fromString(id), user.getId());

        if (existsAds.isEmpty()) {
            throw new ResourceNotFoundException("Ads not found!");
        }

        AdsEntity ads = existsAds.get();

       if (Objects.nonNull(adsUpdateReqDto.getAddress())) {
          ads.setAddress(addressService.replaceAddressById(
                  String.valueOf(ads.getAddress().getId()), adsUpdateReqDto.getAddress()
          ));
       }


       if (Objects.nonNull(adsUpdateReqDto.getPoint())) {
           Point point = factory.createPoint(
                   new Coordinate(
                           adsUpdateReqDto.getPoint().getLongitude(),
                           adsUpdateReqDto.getPoint().getLatitude()
                   )
           );

           ads.setLocation(point);
       }

       if (adsUpdateReqDto.getAd_type() != null) {
           ads.setAd_type(adsUpdateReqDto.getAd_type());
       }

       if (Objects.nonNull(adsUpdateReqDto.getCriteria())) {
           criteriaService.updateCriteria(ads.getCriteria().getId(), adsUpdateReqDto.getCriteria());
       }



       if (!adsUpdateReqDto.getDonation()) {
           ads.setDonation(adsUpdateReqDto.getDonation());
       }

       if (!Double.isNaN(adsUpdateReqDto.getPrice_cents())) {
           ads.setPrice_cents(adsUpdateReqDto.getPrice_cents());
       }

       if (!Double.isNaN(adsUpdateReqDto.getPrice_reco())) {
           ads.setPrice_reco(adsUpdateReqDto.getPrice_reco());
       }

       if (adsUpdateReqDto.getSubject() != null) {
           ads.setSubject(adsUpdateReqDto.getSubject());
       }

       if (adsUpdateReqDto.getBody() != null) {
           ads.setBody(adsUpdateReqDto.getBody());
       }

       if (adsUpdateReqDto.getShipping_type() != null) {
           ads.setShipping_type(adsUpdateReqDto.getShipping_type());
       }

       if (adsUpdateReqDto.getShipping_cost() != null) {
           ads.setShipping_cost(adsUpdateReqDto.getShipping_cost());
       }
       if (!adsUpdateReqDto.getPhoneHiddenInformationText()) {
           ads.setDonation(adsUpdateReqDto.getPhoneHiddenInformationText());
       }

       return adsRepository.save(ads);
   }

   @Override
   @Transactional
   public EmptyEntity removeAds(Principal principal, String id) {
        UserEntity user = userService.findUserByEmail(principal.getName());

        Optional<AdsEntity> existsAds = adsRepository.findAdsEntityByIdAndUserId(UUID.fromString(id), user.getId());

        if (existsAds.isEmpty()) {
            throw new ResourceNotFoundException("Ads not found!");
        }

        AdsEntity ads = existsAds.get();

       ads.setStatus(Status.delete);

       adsRepository.save(ads);

        return new EmptyEntity();
    }


    @Override
    public List<AdsSuggestionsResDto> searchAdsSuggestion(String keyword) {
        List<AdsEntity> ads = adsRepository.findAdsEntityByKeyword(keyword);

        return Ads.toAdsSuggestionsResDtoList(ads);
    }

    @Override
    public List<AdsSearchDto> searchAdsRecent() {
        List<AdsEntity> ads = adsRepository.findAdsEntityRecent();

        return Ads.toSearchDtoList(ads);
    }

    @Override
    @Transactional
    public AdvDto getAdv(String adId, AdsPageReqDto adsPageReqDto) {

        Optional<AdsEntity> existsAds = adsRepository.findActiveAdsEntityById(UUID.fromString(adId));

        if (existsAds.isEmpty()) {
            throw new ResourceNotFoundException("Ads not found!");
        }

        AdsEntity ads = existsAds.get();


        UserEntity user = userService.getUserById(String.valueOf(ads.getUser().getId()));

        Pageable pageable = PageRequest.of(adsPageReqDto.getCurrentPage() - 1, adsPageReqDto.getLimit());

        Page<AdsEntity> page = adsRepository.findAdsEntityByUserId(user.getId(), pageable);

        ads.setViews(ads.getViews() + 1);

        adsRepository.save(ads);

        return AdvDto.builder()
                .ads(Ads.toDto(ads))
                .relatedAds(AdsSearchResDto.builder()
                        .totalPages(page.getTotalPages())
                        .totalItems(page.getTotalElements())
                        .ads(Ads.toSearchDtoList(page.getContent()))
                        .build()
                )
                .build();
    }

    @Override
    public AdsEntity findAdsEntityByPayment(PaymentEntity paymentEntity) {

        Optional<AdsEntity> existsAds = adsRepository.findAdsEntityByPayment(paymentEntity.getId());
        if (existsAds.isEmpty()) {
            throw new ResourceNotFoundException("Ads not found!");
        }

        return existsAds.get();
    }
}
