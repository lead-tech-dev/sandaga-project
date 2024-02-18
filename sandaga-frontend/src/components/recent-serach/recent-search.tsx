import React, {FunctionComponent} from 'react';
import {RecentSearchInterface} from "../../redux/reducers/search.reducer";
import {CloseIcon} from "../../assets/icons/AllSvgIcon";
import Location from "../../assets/icons/Location";
import "./recent-search.style.scss"
import {createQueryParams, getCategoryById, getSubCategoryById} from "../../helpers/Poster";
import {categoriesData} from "../../data/data";
import {urlsFilters} from "../../helpers/Search";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {SearchActionTypes} from "../../redux/types/search.type";
interface RecentSearch {
    recent: RecentSearchInterface;
    index: number;
}
const RecentSearch: FunctionComponent<RecentSearch> = ({ recent, index }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleSearchFilters = () => {
        let urls = urlsFilters(recent)

        let queryString = createQueryParams(urls, recent);

        navigate(`/recherche?${queryString}`, {replace: true})

    }

    const handleDeleteFilters = () => {
        dispatch({
            type: SearchActionTypes.DELETE_FILTERS,
            payload: index
        })
    }

    return (
        <div className="col-12 col-md-4 " key={index}>
        <div className="recent-search-wrapper">
           <span className="icon-close"  onClick={() => handleDeleteFilters()}><CloseIcon/></span>
           <div className="content"  onClick={() => handleSearchFilters()}>
               <div className="header">
                   {recent.filters.keywords ? (
                       <>
                           <h2>{recent.filters.keywords.text[0].toUpperCase() + recent.filters.keywords.text.substring(1)}</h2>
                           {recent.filters.category ? getSubCategoryById(categoriesData, recent.filters.category) ? getSubCategoryById(categoriesData, recent.filters.category).subcategory.name: getCategoryById(categoriesData, recent.filters.category).name : "Toutes les categories"}
                           {recent.filters.ranges || Object.keys(recent.filters.criteria).length > 1 ? " - " : ""}
                           {recent.filters.ranges ? recent.filters.ranges.price.min ? `min ${recent.filters.ranges.price.min} €` : "" : ""}
                           {recent.filters.ranges && Object.keys(recent.filters.criteria).length > 1 && ", "}
                           {recent.filters.ranges ? recent.filters.ranges.price.max ? `max ${recent.filters.ranges.price.max} €` : "" : ""}
                           {recent.filters.ranges && Object.keys(recent.filters.criteria).length > 1 && ", "}
                           {Object.keys(recent.filters.criteria).length > 1 ? `${Object.values(recent.filters.criteria).filter((item)=> item !== "sell").map((item, index) => `${item} ${index < Object.values(recent.filters.criteria).length - 2 ? "," : ""}`)}`: ""}
                       </>
                   ) : (
                       <>
                           <h2>{recent.filters.category ? getSubCategoryById(categoriesData, recent.filters.category) ? getSubCategoryById(categoriesData, recent.filters.category).subcategory.name: getCategoryById(categoriesData, recent.filters.category).name : "Toutes les categories"}</h2>
                           {recent.filters.ranges ? recent.filters.ranges.price.min ? `min ${recent.filters.ranges.price.min} €` : "" : ""}
                           {recent.filters.ranges && recent.filters.ranges.price.min &&", "}
                           {recent.filters.ranges ? recent.filters.ranges.price.max ? `max ${recent.filters.ranges.price.max} €` : "" : ""}
                           {recent.filters.ranges && recent.filters.ranges.price.max &&", "}
                           {Object.keys(recent.filters.criteria).length > 1 ? `${Object.values(recent.filters.criteria).filter((item)=> item !== "sell").map((item, index) => `${item} ${index < Object.values(recent.filters.criteria).length - 2 ? "," : ""}`)}`: ""}
                       </>
                   )}

               </div>
               <div className="location">
                   <Location/>
                   {recent.filters.location ? "Autour de " + recent.filters.location.city + " - " + recent.filters.location.point.radius + " km" : "Toute la france"}
               </div>
           </div>
        </div>
        </div>
    )
};

export default RecentSearch;