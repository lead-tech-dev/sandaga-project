package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.dtos.criteria.CriteriaDto;
import com.mjtech.sandaga.dtos.search.AdsSearchReqDto;
import com.mjtech.sandaga.dtos.search.SearchListReqDto;
import com.mjtech.sandaga.dtos.search.SearchListResDto;
import com.mjtech.sandaga.entity.*;
import com.mjtech.sandaga.repository.SearchRepository;
import com.mjtech.sandaga.service.CriteriaService;
import com.mjtech.sandaga.service.SearchService;
import com.mjtech.sandaga.service.UserService;
import com.mjtech.sandaga.specifications.AdsSpecifications;
import com.mjtech.sandaga.utility.dto.Criteria;
import com.mjtech.sandaga.utility.dto.Search;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;


@Service
public class SearchServiceImpl implements SearchService {
    private final SearchRepository searchRepository;
    private final UserService userService;
    private final CriteriaService criteriaService;
    public SearchServiceImpl(SearchRepository searchRepository, UserService userService, CriteriaService criteriaService) {
        this.searchRepository = searchRepository;
    this.userService = userService;this.criteriaService = criteriaService;}
    @Override
    public AdsSearchReqDto addUserSearch(AdsSearchReqDto adsSearchReqDto, Principal principal) {
        SearchEntity search = new SearchEntity();
        CriteriaEntity criteria = new CriteriaEntity();
        UserEntity user = userService.findUserByEmail(principal.getName());

        if (adsSearchReqDto.getFilters().getCategory() != null && !adsSearchReqDto.getFilters().getCategory().isEmpty()) {
            search.setCategory(adsSearchReqDto.getFilters().getCategory());
        }

        if (adsSearchReqDto.getFilters().getKeywords() != null && !adsSearchReqDto.getFilters().getKeywords().getText().isEmpty()) {
            search.setText(adsSearchReqDto.getFilters().getKeywords().getText());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getItem_condition() != null) {
            criteria.setItem_condition(adsSearchReqDto.getFilters().getCriteria().getItem_condition());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getVideo_game_type() != null) {
            criteria.setVideo_game_type(adsSearchReqDto.getFilters().getCriteria().getVideo_game_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getConsole_model() != null) {
            criteria.setConsole_model(adsSearchReqDto.getFilters().getCriteria().getConsole_model());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getConsole_brand() != null) {
            criteria.setConsole_brand(adsSearchReqDto.getFilters().getCriteria().getConsole_brand());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getImage_sound_type_of_product() != null) {
            criteria.setImage_sound_type_of_product(adsSearchReqDto.getFilters().getCriteria().getImage_sound_type_of_product());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getImage_sound_product() != null) {
            criteria.setImage_sound_product(adsSearchReqDto.getFilters().getCriteria().getImage_sound_product());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getPhone_brand() != null) {
            criteria.setPhone_brand(adsSearchReqDto.getFilters().getCriteria().getPhone_brand());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getPhone_color() != null) {
            criteria.setPhone_color(adsSearchReqDto.getFilters().getCriteria().getPhone_color());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getPhone_model() != null) {
            criteria.setPhone_model(adsSearchReqDto.getFilters().getCriteria().getPhone_model());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getPhone_memory() != null) {
            criteria.setPhone_memory(adsSearchReqDto.getFilters().getCriteria().getPhone_memory());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getFurniture_type() != null) {
            criteria.setFurniture_type(adsSearchReqDto.getFilters().getCriteria().getFurniture_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getFurniture_material() != null) {
            criteria.setFurniture_material(adsSearchReqDto.getFilters().getCriteria().getFurniture_material());
       }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getFurniture_color() != null) {
            criteria.setFurniture_color(adsSearchReqDto.getFilters().getCriteria().getFurniture_color());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getHome_appliance_type() != null) {
            criteria.setHome_appliance_type(adsSearchReqDto.getFilters().getCriteria().getHome_appliance_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getHome_appliance_product() != null) {
            criteria.setHome_appliance_product(adsSearchReqDto.getFilters().getCriteria().getHome_appliance_product());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getHome_appliance_brand() != null) {
            criteria.setHome_appliance_brand(adsSearchReqDto.getFilters().getCriteria().getHome_appliance_brand());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getTable_art_product() != null) {
            criteria.setTable_art_product(adsSearchReqDto.getFilters().getCriteria().getTable_art_product());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getTable_art_material() != null) {
            criteria.setTable_art_material(adsSearchReqDto.getFilters().getCriteria().getTable_art_material());
       }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getDecoration_type() != null) {
            criteria.setDecoration_type(adsSearchReqDto.getFilters().getCriteria().getDecoration_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getLinens_type() != null) {
            criteria.setLinens_type(adsSearchReqDto.getFilters().getCriteria().getLinens_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getLinens_product() != null) {
            criteria.setLinens_product(adsSearchReqDto.getFilters().getCriteria().getLinens_product());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getLinens_material() != null) {
            criteria.setLinens_material(adsSearchReqDto.getFilters().getCriteria().getLinens_material());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getDiy_type() != null) {
            criteria.setDiy_type(adsSearchReqDto.getFilters().getCriteria().getDiy_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getDiy_product() != null) {
            criteria.setDiy_product(adsSearchReqDto.getFilters().getCriteria().getDiy_product());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getGardening_type() != null) {
            criteria.setGardening_type(adsSearchReqDto.getFilters().getCriteria().getGardening_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getGardening_product() != null) {
            criteria.setGardening_product(adsSearchReqDto.getFilters().getCriteria().getGardening_product());
       }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getClothing_type() != null) {
            criteria.setClothing_type(adsSearchReqDto.getFilters().getCriteria().getClothing_type());
         }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getClothing_st() != null) {
            criteria.setClothing_st(adsSearchReqDto.getFilters().getCriteria().getClothing_st());
       }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getClothing_category() != null) {
            criteria.setClothing_category(adsSearchReqDto.getFilters().getCriteria().getClothing_category());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getClothing_brand() != null) {
            criteria.setClothing_brand(adsSearchReqDto.getFilters().getCriteria().getClothing_brand());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getClothing_color() != null) {
            criteria.setClothing_color(adsSearchReqDto.getFilters().getCriteria().getClothing_color());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getClothing_condition() != null) {
            criteria.setClothing_condition(adsSearchReqDto.getFilters().getCriteria().getClothing_condition());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getShoe_type() != null) {
            criteria.setShoe_type(adsSearchReqDto.getFilters().getCriteria().getShoe_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getShoe_category() != null) {
            criteria.setShoe_category(adsSearchReqDto.getFilters().getCriteria().getShoe_category());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getShoe_size() != null) {
            criteria.setShoe_size(adsSearchReqDto.getFilters().getCriteria().getShoe_size());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getShoe_brand() != null) {
            criteria.setShoe_brand(adsSearchReqDto.getFilters().getCriteria().getShoe_brand());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getAccessories_univers() != null) {
            criteria.setAccessories_univers(adsSearchReqDto.getFilters().getCriteria().getAccessories_univers());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getAccessories_type() != null) {
            criteria.setAccessories_type(adsSearchReqDto.getFilters().getCriteria().getAccessories_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getAccessories_brand() != null) {
            criteria.setAccessories_brand(adsSearchReqDto.getFilters().getCriteria().getAccessories_brand());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getAccessories_material() != null) {
            criteria.setAccessories_material(adsSearchReqDto.getFilters().getCriteria().getAccessories_material());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getWatches_jewels_brand() != null) {
            criteria.setWatches_jewels_brand(adsSearchReqDto.getFilters().getCriteria().getWatches_jewels_brand());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getWatches_jewels_type() != null) {
            criteria.setWatches_jewels_type(adsSearchReqDto.getFilters().getCriteria().getWatches_jewels_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getWatches_jewels_material() != null) {
            criteria.setWatches_jewels_material(adsSearchReqDto.getFilters().getCriteria().getWatches_jewels_material());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getBaby_equipment_type() != null) {
            criteria.setBaby_equipment_type(adsSearchReqDto.getFilters().getCriteria().getBaby_equipment_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getBaby_equipment_brand() != null) {
            criteria.setBaby_equipment_brand(adsSearchReqDto.getFilters().getCriteria().getBaby_equipment_brand());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getBaby_clothing_category() != null) {
            criteria.setBaby_clothing_category(adsSearchReqDto.getFilters().getCriteria().getBaby_clothing_category());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getBaby_clothing_brand() != null) {
            criteria.setBaby_clothing_brand(adsSearchReqDto.getFilters().getCriteria().getBaby_clothing_brand());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getBaby_age()  != null) {
            criteria.setBaby_age(adsSearchReqDto.getFilters().getCriteria().getBaby_age());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getBicycle_type() != null) {
            criteria.setBicycle_type(adsSearchReqDto.getFilters().getCriteria().getBicycle_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getBicycle_size() != null) {
            criteria.setBicycle_type(adsSearchReqDto.getFilters().getCriteria().getBicycle_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getSports_hobbies_activity() != null) {
            criteria.setSports_hobbies_activity(adsSearchReqDto.getFilters().getCriteria().getSports_hobbies_activity());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getToy_age() != null) {
            criteria.setToy_age(adsSearchReqDto.getFilters().getCriteria().getToy_age());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getToy_type() != null) {
            criteria.setToy_type(adsSearchReqDto.getFilters().getCriteria().getToy_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getMatpro_agriculture_equipment_type() != null) {
            criteria.setMatpro_agriculture_equipment_type(adsSearchReqDto.getFilters().getCriteria().getMatpro_agriculture_equipment_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getMatpro_transport_handling_equipment_type() != null) {
            criteria.setMatpro_transport_handling_equipment_type(adsSearchReqDto.getFilters().getCriteria().getMatpro_transport_handling_equipment_type());
        }
        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getMatpro_btp_equipment_type() != null) {
            criteria.setMatpro_btp_equipment_type(adsSearchReqDto.getFilters().getCriteria().getMatpro_btp_equipment_type());
        }

        if (adsSearchReqDto.getFilters().getCriteria() != null && adsSearchReqDto.getFilters().getCriteria().getRegdate() != null) {
            criteria.setRegdate(adsSearchReqDto.getFilters().getCriteria().getRegdate());
        }

        if (adsSearchReqDto.getFilters().getRanges() != null ) {
            if (adsSearchReqDto.getFilters().getRanges().getPrice().getMin() != 0) {
                search.setMin(String.valueOf(adsSearchReqDto.getFilters().getRanges().getPrice().getMin()));
            }
            if (adsSearchReqDto.getFilters().getRanges().getPrice().getMax() != 0) {
                search.setMax(String.valueOf(adsSearchReqDto.getFilters().getRanges().getPrice().getMax()));
            }
        }


        if (adsSearchReqDto.getFilters().getLocation() != null) {
            search.setLocation(
                    adsSearchReqDto.getFilters().getLocation().getCity()
                            + "_" +
                            adsSearchReqDto.getFilters().getLocation().getPoint().getLat()
                            + "_" +
                            adsSearchReqDto.getFilters().getLocation().getPoint().getLng()
                            + "_" +
                            adsSearchReqDto.getFilters().getLocation().getPoint().getRadius()
            );
        }


        search.setOrder(adsSearchReqDto.getOrder());
        search.setSort(adsSearchReqDto.getSort());
        search.setLimit(adsSearchReqDto.getLimit());
        search.setCurrentPage(adsSearchReqDto.getCurrentPage());
        search.setCriteria(criteriaService.addCriteria(Criteria.toDto(criteria)));
        search.setUser(user);

        SearchEntity  searchRes = searchRepository.save(search);

        return Search.toDto(searchRes);
   }
    @Override
    public EmptyEntity deleteUserSearch(String id, Principal principal) {
        searchRepository.deleteById(UUID.fromString(id));
    return new EmptyEntity();
    }

    @Override
    public SearchListResDto getUserSearch(Principal principal, SearchListReqDto searchListReqDto) {
        UserEntity user = userService.findUserByEmail(principal.getName());

        Pageable pageable = PageRequest.of(searchListReqDto.getCurrentPage() - 1, searchListReqDto.getLimit());

        Page<SearchEntity> page = searchRepository.findSearchEntityByUserId(user.getId(), pageable);

        return SearchListResDto.builder()
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .searches(Search.toAdsSearchReqDtoList(page.getContent()))
                .build();
    }
}
