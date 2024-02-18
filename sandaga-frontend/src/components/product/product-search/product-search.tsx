import React, {FunctionComponent} from 'react';
import {createQueryParams, getCategoryById, getSubCategoryById} from "../../../helpers/Poster";
import {categoriesData} from "../../../data/data";
import Location from "../../../assets/icons/Location";

import "./product-search.style.scss";
import Button from "../../Button";
import {urlsFilters} from "../../../helpers/Search";
import {useNavigate} from "react-router-dom";

interface ProductSearchProps {
    searches: any
    deleteSearch: (id: string) => void;
    loading: boolean;
    index: number;
    setCurrentId: Function;
}


const ProductSearch:FunctionComponent<ProductSearchProps> = ({setCurrentId, searches, deleteSearch, loading, index}) => {

    const navigate = useNavigate();
    const handleSearchFilters = (e: any, recent: any) => {
        e.preventDefault();

        let urls = urlsFilters(recent)

        let queryString = createQueryParams(urls, recent);

        navigate(`/recherche?${queryString}`, {replace: true})

    }
    const handleDeleteSearch = (e: any, id: string) => {
        e.preventDefault();
        if (window.confirm(`voulez-vous vraiment supprimer cette recherche ? `)) {
            deleteSearch(id)
            setCurrentId(id)
        }

    }
    return (
            <div className="searches-search-wrapper" key={index}>
                <div className="content"  onClick={() => console.log("")}>
                    <div className="header">
                        {searches.filters.keywords ? (
                            <>
                                <h2>{searches.filters.keywords.text[0].toUpperCase() + searches.filters.keywords.text.substring(1)}</h2>
                                {searches.filters.category ? getSubCategoryById(categoriesData, searches.filters.category) ? getSubCategoryById(categoriesData, searches.filters.category).subcategory.name : getCategoryById(categoriesData, searches.filters.category).name : "Toutes les categories"}
                                {searches.filters.ranges || Object.keys(searches.filters.criteria).length > 1 ? " - " : ""}
                                {searches.filters.ranges ? searches.filters.ranges.price.min ? `min ${searches.filters.ranges.price.min} €` : "" : ""}
                                {searches.filters.ranges && Object.keys(searches.filters.criteria).length > 1 && ", "}
                                {searches.filters.ranges ? searches.filters.ranges.price.max ? `max ${searches.filters.ranges.price.max} €` : "" : ""}
                                {searches.filters.ranges && Object.keys(searches.filters.criteria).length > 1 && ", "}
                                {Object.keys(searches.filters.criteria).length > 1 ? `${Object.values(searches.filters.criteria).filter((item)=> item !== "sell").map((item, index) => `${item} ${index < Object.values(searches.filters.criteria).length - 2 ? "," : ""}`)}`: ""}
                            </>
                        ) : (
                            <>
                                <h2>{searches.filters.category ? getSubCategoryById(categoriesData, searches.filters.category) ? getSubCategoryById(categoriesData, searches.filters.category).subcategory.name: getCategoryById(categoriesData, searches.filters.category).name : "Toutes les categories"}</h2>
                                {searches.filters.ranges ? searches.filters.ranges.price.min ? `min ${searches.filters.ranges.price.min} €` : "" : ""}
                                {searches.filters.ranges && searches.filters.ranges.price.min &&", "}
                                {searches.filters.ranges ? searches.filters.ranges.price.max ? `max ${searches.filters.ranges.price.max} €` : "" : ""}
                                {searches.filters.ranges && searches.filters.ranges.price.max &&", "}
                                {Object.keys(searches.filters.criteria).length > 1 ? `${Object.values(searches.filters.criteria).filter((item)=> item !== "sell").map((item, index) => `${item} ${index < Object.values(searches.filters.criteria).length - 2 ? "," : ""}`)}`: ""}
                            </>
                        )}

                    </div>
                    <div className="location">
                        <Location/>
                        {searches.filters.location ? "Autour de " + searches.filters.location.city + " - " + searches.filters.location.point.radius + " km" : "Toute la france"}
                    </div>
                </div>
                <div className="buttons">
                    <Button
                        label="Afficher"
                        className={`btn btn-primary`}
                        type="link"
                        onClick={(e) => handleSearchFilters(e, searches)}
                        iconLeft={<i className="fa fa-eye" /> }
                    />

                    <Button
                        label="Supprimer"
                        className={`btn btn-default`}
                        type="link"
                        onClick={(e) => handleDeleteSearch(e, searches.id)}
                        disabled={loading}
                        iconLeft={<i className="fa fa-trash-alt" /> }
                    />
                </div>
            </div>

    );
}

export default ProductSearch;