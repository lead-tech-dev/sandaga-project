import React, {memo} from 'react';
import Clock from "../../assets/icons/Clock";
import {State} from "../../redux/types";
import {connect, ConnectedProps} from "react-redux";
import {
    createQueryParams,
    getCategoryById,
    getSubCategoryById
} from "../../helpers/Poster";
import {categoriesData} from "../../data/data";
import {CloseIcon, SearchIconSmall} from "../../assets/icons/AllSvgIcon";
import {urlsFilters} from "../../helpers/Search";
import {useNavigate} from "react-router-dom";


type SuggestionsProps = {
    suggestions?: any;
    itemStyle?: any;
    wrapperStyle?: any;
    setSuggestionValue?: any;
    clearSearch?: any;
    searchKey: string
    setToggleSuggestion: Function,
    setSearchValueText: (text: string) => void;
};

const SearchResults: React.FC<SuggestionsProps & SearchResultsProps> = ({
                                                       searchKey,
                                                       suggestions,
                                                       setSuggestionValue,
                                                       clearSearch,
                                                       search: {recent},
                                                       setToggleSuggestion,
                                                       setSearchValueText
                                                   }) => {
    const navigate = useNavigate();
    const setSuggestion = (suggestion: any) => {

        setSuggestionValue(suggestion.categoryId, suggestion.body.substring(suggestion.body.indexOf(searchKey)).split(" ")[0]);
    };

    const handleSearchFilters = (index: number) => {
        let urls = urlsFilters(recent[index])

       // console.log(urls)

        let queryString = createQueryParams(urls, recent[index]);

        navigate(`/recherche?${queryString}`, {replace: true})
        setToggleSuggestion();

        if (urls.text) {
            setSearchValueText(urls.text);
        }
    }


    return (
        <ul className="search-result-wrapper">
            {!suggestions && (
                <>
                    {recent.length > 0 && (
                        <div className="">
                            <div className="submenu-heading">
                                <h3>Recherches récentes</h3>
                            </div>
                            {recent.map((recentSearch: any, index: number) => (
                                <li
                                    className="item-wrapper-search"
                                    key={recentSearch}
                                >
                                    <div className="recent-box">
                                        <span className="svg"> <Clock/></span>
                                        <span className="close" onClick={() => clearSearch(index)}><CloseIcon/></span>
                                        <div className="details" onClick={() => handleSearchFilters(index)}>
                                            <span className="category"> <span>{recentSearch.filters.keywords ? `${recentSearch.filters.keywords.text} dans` : ""} </span> {recentSearch.filters.category ? getSubCategoryById(categoriesData, recentSearch.filters.category) ? getSubCategoryById(categoriesData, recentSearch.filters.category).subcategory.name : getCategoryById(categoriesData, recentSearch.filters.category).name : "Toutes les catégories"}</span>
                                            <span className="criteria">
                                        {recentSearch.filters.location ?
                                            "Autour de " + recentSearch.filters.location.city + " (Toute la ville) - " +  recentSearch.filters.location.point.radius + " km" :
                                            "Toute la france"}
                                                {recentSearch.filters.ranges ? recentSearch.filters.ranges.price.min ? `, min ${recentSearch.filters.ranges.price.min} €` : "" : ""}
                                                {recentSearch.filters.ranges ? recentSearch.filters.ranges.price.max ? `, max ${recentSearch.filters.ranges.price.max} €` : "" : ""}
                                                {Object.keys(recentSearch.filters.criteria).length > 1 ? `, ${Object.values(recentSearch.filters.criteria).filter(item => item !== "sell").map(item => item)}`: ""}
                                    </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </div>
                    )}
                </>

            )}

            {suggestions && (
                <div className="">
                    <div className="submenu-heading">
                        <h3>Suggestions</h3>
                    </div>
                    {suggestions.length > 0 ?
                        suggestions.map((suggestion: any) => (
                               <>
                                   {
                                       suggestion.body.indexOf(searchKey) !== -1 && (
                                           <li
                                               className="item-wrapper-search"
                                               key={suggestion}
                                               onClick={() => setSuggestion(suggestion)}
                                           >
                                               <span className="svg"> <SearchIconSmall/></span>
                                               <span className="search-key">{suggestion.body.substring(suggestion.body.indexOf(searchKey)).split(" ")[0]}</span>
                                               <span className="middle">dans</span>
                                               <span className="category">{suggestion.categoryLabel}</span>
                                           </li>
                                       )
                                   }
                               </>
                            )
                        ) :  (
                            <li
                                className="item-wrapper-search"
                            >
                                <span className="search-key">Pas de résultats</span>

                            </li>
                        )
                    }
                </div>
            )}
        </ul>
    );
};

const mapStateToProps = (state: State) => ({
    search: state.search,
});


const connector = connect(mapStateToProps, null);

type SearchResultsProps = ConnectedProps<typeof connector>;

export default connector(memo(SearchResults))
