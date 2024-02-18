import React, {Fragment, FunctionComponent, memo, useEffect, useRef, useState} from "react";
import Close from "../assets/icons/Close";
import Filter from "../components/Filter";
import Button from "../components/Button";
import ArrowRight from "../assets/icons/ArrowRight";
import Filtrer from "../assets/icons/Filtrer";
import Back from "../assets/icons/Back";
import {ad_type, categoriesData, criteriaData, price, sort} from "../data/data";
import {CategoryInterface, FieldsInterface, SubCategoryInterface} from "../interfaces/ads.interface";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {
    createQueryParams,
    exitsCategory,
    getCategoryById,
    getCategoryCriteria,
    getSubCategoryById, getUrls
} from "../helpers/Poster";
import {SearchActionTypes} from "../redux/types/search.type";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import {State} from "../redux/types";
import SelectSearch from "../components/selects/select-search/select-search";
import SelectLocation from "../components/selects/select-location/select-location";
import SkeletonOne from "../components/skeleton/skeleton";
import {defaultHeaders, SEARCH_URL} from "../hooks/useConfig";
import Pagination from "../components/pagination/pagination";
import NoResult from "../components/no-result/no-result";
import {equalCriteria, storeFilters} from "../helpers/Search";
import { RecentSearchInterface} from "../redux/reducers/search.reducer";
import ProductGlobal from "../components/product/product-global/product-global";
import SectionTitle from "../components/section-title/section-title";
import {Dispatch} from "redux";
import {addSearch} from "../redux/actions/search.actions";
import SaveSearch from "../components/save-search/save-search";
import Skeleton from "../containers/skeleton/skeleton";
import {SEO} from "../components/seo";


const Search: FunctionComponent<SearchProps> = ({auth: {credentials}, search: { recent: recentStore, loading: loadingSearch, success}, addSearch }) => {
    const [selectedCategory, setSelectedCategory] = useState<CategoryInterface | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryInterface | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedCreteria, setSelectedCreteria] = useState<FieldsInterface | null>(null);
    const [searchCreteria, setSearchCreteria] = useState<FieldsInterface[] | null>(null);
    const [ads, setAds] = useState<any>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalItems, setTotalItems] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true);
    const [recent, setRecent] = useState<RecentSearchInterface>({filters: {criteria: {ad_type: "sell"}}, limit: 20, order: "desc", sort: "time", currentPage: 1});
    const [saveSearches, setSaveSearches] = useState<boolean>(false)
    const pageTopRef = useRef<HTMLDivElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryId = searchParams.get("category")
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {


        if (categoryId) {
            let exits = exitsCategory(categoryId, categoriesData);

            if (exits.exist) {

                if (exits.type === "category") {

                    let cat =  getCategoryById(categoriesData, categoryId) as CategoryInterface;
                    cat && setSelectedCategory(cat);
                }else {
                    let subCat =  getSubCategoryById(categoriesData, categoryId) ;
                    let criteria = getCategoryCriteria(criteriaData, subCat.subcategory);

                    subCat && setSelectedSubCategory(subCat.subcategory)
                    setSearchCreteria(criteria)
                }
            }
        }else {
            setSelectedCategory(null)
            setSelectedSubCategory(null)
            setSearchCreteria(null)
        }


    }, [categoryId]);

    useEffect(() => {
        if (searchParams) {
            let urls = getUrls(searchParams);
            let recents = storeFilters(recent, urls);

            setRecent(recents)
            searchApiCall(recents)

            if (credentials  && (recents.filters.keywords || recents.filters.location || (recents.filters.criteria && Object.keys(recents.filters.criteria).length > 1))) {
                setSaveSearches(true)
            }else {
                setSaveSearches(false)
            }
        }

    }, [searchParams]);
    const searchApiCall = (recentData: any) => {
            setLoading(true);
            fetch(SEARCH_URL, {
                method: "POST",
                mode: "cors",
                headers: {
                    ...defaultHeaders(),
                },
                body: JSON.stringify({...recentData}),
            })
                .then((response) => Promise.all([response, response.json()]))
                .then(([response, json]) => {

                    if (response.ok){
                        setAds(json.ads)
                        setTotalItems(json.totalItems)
                        setTotalPages(json.totalPages)

                        setLoading(false)
                    }

                })
                .catch((err) => {
                    setLoading(false)
                    console.log(err);
                });

    }

    const triggerMobileMenu = () => {
        const offcanvasMobileMenu = document.querySelector("#filter-menu");
        offcanvasMobileMenu?.classList.toggle("active");

        document.body.classList.toggle("hidden");


        setTimeout(() => {
            setOpen(false);
        }, 500);

    };

    const handleSaveSearch = (e: any) => {
        e.preventDefault();

        let urls = getUrls(searchParams)

        let store = storeFilters(recent, urls);

        if (credentials) {
            let data = credentials["searches"] as any;
            let isEqual = false;

            data.forEach((item: any) => {
                if (equalCriteria(item, store)) {
                    isEqual = true;
                }
            })



            if (isEqual) {
                dispatch({
                    type: SearchActionTypes.SEARCH_SUCCESS
                })
            } else if (store.filters.keywords || store.filters.location || (store.filters.criteria && Object.keys(store.filters.criteria).length > 1)) {
                addSearch(store)
            }
        }


    }

    const handleRecentSearch = () => {
        let urls = getUrls(searchParams)

        let store = storeFilters(recent, urls)

        if (store.filters.keywords || store.filters.location || (store.filters.criteria && Object.keys(store.filters.criteria).length > 1)) {
           dispatch({
                type: SearchActionTypes.ADD_LOCATION,
                payload: store
            })
        }

        triggerMobileMenu();
    }

    const addKeySearch = (criteria: FieldsInterface) => {
        setSelectedCreteria(criteria)
        setOpen(true)
    };

    const addUrl = (name: string, value: string) => {
        const query = new URLSearchParams(location.search);
       let urls = getUrls(query);

        urls[name] = value;

        let queryString = createQueryParams(urls, recent);

        navigate(`/recherche?${queryString}`, {replace: true})

    }

    const deleteUrl = (name: string) => {
        const query = new URLSearchParams(location.search);
        let urls = getUrls(query);

        delete urls[name]

        let queryString = createQueryParams(urls, recent);

        navigate(`/recherche?${queryString}`, {replace: true})
    }

    const clearUrl = () => {
        const query = new URLSearchParams(location.search);
        let remove = ["category", "sort", "location", "order", "min", "max", "page"];

        let urls = getUrls(query);

        Object.keys(urls).forEach(item => {
            if (!remove.includes(item)) {
                delete urls[item]
            }
        })

        let queryString = createQueryParams(urls, recent);

        navigate(`/recherche?${queryString}`, {replace: true})

    }

   const onNextPageClick = (e: any) => {
        e.preventDefault();
           const newPage =  Math.min(parseInt(String(recent.currentPage)) + 1, totalPages);

           handleChangePage(newPage)
    }

    const onPrevPageClick = (e: any) => {

            const newPage = Math.max(parseInt(String(recent.currentPage)) - 1, 1);

            handleChangePage(newPage)
    }

    const handleChangePage = (newPage: number) => {

        addUrl("page", String(newPage))

        pageTopRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
       <Fragment>
           <SEO title="Rechercher - Sandaga" description="Rechercher une annonce" />
           <div ref={pageTopRef}>
               <section className="">
                   <div className="container">
                       <div className="row">
                           <div className="col-12">
                               <div className="boxed-container search-results">
                                   <div className="row">
                                       <div className="col-12">
                                           <form action="#" method="post" className="search-block">
                                               <div className="row">

                                                   <div className="col-12 col-md-6 col-lg-4 md-mb-5">
                                                       <SelectLocation
                                                           label="Où cherchez-vous ?"
                                                           onOptionSelected={(option) => addUrl(option.name, option.value)}
                                                           onOptionDelete={(name) => deleteUrl(name)}
                                                           recent={recent}
                                                       />
                                                   </div>
                                                   <div className="col-12 col-md-6 col-lg-4 md-mb-5">
                                                       <SelectSearch
                                                           options={categoriesData}
                                                           onOptionSelected={(option) => addUrl(option.name, option.value)}
                                                           icon={true}
                                                       />
                                                   </div>

                                                   <div className="col-12 col-md-6 col-lg-4">
                                                       <div className="more-filter-inner">
                                                           <div className="more-filter">
                                                               <div className="">
                                                                   <Button
                                                                       label={recent.filters.ranges  && recent.filters.ranges.price["min"] && !recent.filters.ranges.price["max"]
                                                                           ? `min ${recent.filters.ranges.price["min"]} €`
                                                                           : recent.filters.ranges  && recent.filters.ranges.price["max"] && !recent.filters.ranges.price["min"]
                                                                               ? `max ${recent.filters.ranges.price["max"]} €`
                                                                               : recent.filters.ranges && recent.filters.ranges.price["max"] && recent.filters.ranges.price["min"]
                                                                                   ? `${recent.filters.ranges.price["min"]} - ${recent.filters.ranges.price["max"]} €`
                                                                                   : "Prix"
                                                                       }
                                                                       className="btn-transparent-3 right full-height"
                                                                       type="button"
                                                                       onClick={() => triggerMobileMenu()}
                                                                       iconRight={<ArrowRight />}
                                                                   />
                                                               </div>

                                                               <div className="">
                                                                   <Button
                                                                       label="filtres"
                                                                       className="btn-transparent-3 left full-height"
                                                                       type="button"
                                                                       onClick={() => triggerMobileMenu()}
                                                                       iconLeft={<Filtrer />}
                                                                       number={Object.keys(recent.filters.criteria).length - 1 === 0 ? null : Object.keys(recent.filters.criteria).length - 1}
                                                                   />
                                                               </div>
                                                           </div>
                                                       </div>
                                                   </div>
                                               </div>

                                           </form>
                                       </div>
                                   </div>

                               </div>
                           </div>
                           <div className="col-12">
                               <div className="filter-menu" id="filter-menu">
                                   <div className="filter-overlay"></div>

                                   <div className={`filter-wrapper  ${open && "open"}`}>
                                       <div className="filter-header-area">
                                           {!open && <h3>Tous les filtres</h3>}
                                           {open && (
                                               <div className="sub-categorie-header">
                                                   <div className="filter-menu-back">
                                                       <a
                                                           role="button"
                                                           className="btn-advance-search"
                                                           onClick={() => setOpen(false)}
                                                       >
                                                           <Back />
                                                       </a>
                                                   </div>
                                                   <h3>{selectedCreteria?.label}</h3>
                                               </div>
                                           )}

                                           <div className="filter-menu-close">
                                               <a
                                                   role="button"
                                                   className="btn-advance-search"
                                               >
                                                   <Close onClick={(e) =>  handleRecentSearch()} />
                                               </a>
                                           </div>
                                       </div>
                                       <div className="filter-inner-content">
                                           {!open && (
                                               <div className="row">
                                                   <div className="col-12">

                                                       {!searchCreteria && !selectedSubCategory && selectedCategory && (
                                                           <Filter
                                                               category={selectedCategory.label}
                                                               handleSearchKey={addKeySearch}
                                                               onOptionSelected={(option) => console.log("")}
                                                           />
                                                       )}

                                                       {searchCreteria && selectedSubCategory && !selectedCategory && (
                                                           <Filter
                                                               category={selectedSubCategory.label}
                                                               handleSearchKey={addKeySearch}
                                                               onOptionSelected={(option) => console.log(option)}
                                                           />
                                                       )}

                                                       {!searchCreteria && !selectedSubCategory && !selectedCategory && (
                                                           <Filter
                                                               category="Toutes les categories"
                                                               handleSearchKey={addKeySearch}
                                                               onOptionSelected={(option) => console.log(option)}
                                                           />
                                                       )}


                                                       <div className="col-12" >
                                                           <Filter
                                                               price={price}
                                                               handleSearchKey={addKeySearch}
                                                               onOptionSelected={(option) => addUrl(option.name, option.value)}
                                                               data={{...recent}}
                                                               onOptionDelete={(name) => deleteUrl(name)}
                                                           />
                                                       </div>


                                                       {searchCreteria && selectedSubCategory &&
                                                           searchCreteria.map((item, index) => (
                                                               <div className="col-12" key={index}>
                                                                   <Filter
                                                                       category={selectedSubCategory.label}
                                                                       criteria={item}
                                                                       handleSearchKey={addKeySearch}
                                                                       onOptionSelected={(option) => addUrl(option.name, option.value)}
                                                                       data={{...recent}}
                                                                   />
                                                               </div>
                                                           ))
                                                       }

                                                       {sort && (
                                                           <div className="col-12" >
                                                               <Filter
                                                                   sort={sort}
                                                                   handleSearchKey={addKeySearch}
                                                                   onOptionSelected={(option) => addUrl(
                                                                       option.name, option.value)}
                                                                   data={{...recent}}
                                                               />
                                                           </div>
                                                       )}

                                                       {selectedSubCategory && Object.keys(Object.values(selectedSubCategory.rights)[0]).length > 1 && (
                                                           <div className="col-12" >
                                                               <Filter
                                                                   ad_type={ad_type}
                                                                   handleSearchKey={addKeySearch}
                                                                   onOptionSelected={(option) => addUrl(option.name, option.value)}
                                                                   data={{...recent}}
                                                               />
                                                           </div>
                                                       )}


                                                   </div>

                                               </div>
                                           )}

                                           {open && (
                                               <div className="row">
                                                   {selectedCreteria && selectedSubCategory &&

                                                       <div className="col-12">
                                                           <Filter
                                                               category={selectedSubCategory.label}
                                                               criteria={selectedCreteria}
                                                               handleSearchKey={addKeySearch}
                                                               openSubCat
                                                               onOptionSelected={(option) => addUrl(option.name, option.value)}
                                                               data={{...recent}}
                                                           />
                                                       </div>

                                                   }
                                               </div>
                                           )}
                                       </div>
                                       <div className="filter-footer-area">
                                           <div className="filter-footer-inner">
                                               <div className="left">
                                                   <Button
                                                       label="Tout Effacer"
                                                       type="button"
                                                       className="btn-canceled right full-height"
                                                       onClick={() => clearUrl()}
                                                   />
                                               </div>
                                               <div className="right">
                                                   <Button
                                                       label={`Rechercher (${totalItems})`}
                                                       type="button"
                                                       className="btn btn-primary"
                                                       onClick={() => handleRecentSearch()}
                                                   />
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </section>
               <section className="product-wrapper grid-3 grid mt-40">
                   <div className="container">
                       {
                           loading
                               ?
                               <div className="row">
                                   <Skeleton size={8}/>
                               </div>
                               : ads instanceof Array && ads.length > 0 ? (
                                   <>
                                       <div className="row">
                                           <div className="col-12">
                                               <SectionTitle
                                                   titleText={  `Annonces ${selectedCategory && !selectedSubCategory
                                                       ? selectedCategory.label[0].toUpperCase() + selectedCategory.label.substring(1).toLowerCase()
                                                       :  selectedSubCategory && selectedSubCategory.label ? selectedSubCategory.label : ""} : ${ recent.filters.location ? recent.filters.location.city :  "Toute la france "}`}
                                                   subtitleText={`(${totalItems} resultats)`}
                                                   positionClass="left"
                                                   spaceClass="mb-55"
                                               />
                                           </div>
                                       </div>
                                       <div className="row">
                                           { ads && ads.filter((item: any) => item.status !== "delete").map((item: any, index: number) => (
                                               <ProductGlobal
                                                   ads={item}
                                                   display="list"
                                                   index={index}
                                               />
                                           ))}
                                       </div>
                                       <div className="row">
                                           <div className="col-12 text-center">
                                               <Pagination
                                                   pageCount={totalPages}
                                                   nextPage={(e) => onNextPageClick(e)}
                                                   prevPage={(e) => onPrevPageClick(e)}
                                                   setPage={(page) => handleChangePage(page)}
                                                   currentPage={recent.currentPage}/>
                                           </div>
                                       </div>
                                   </>
                               ): (
                                   <NoResult link="/recherche" msg="Reformuler la recherche" />
                               )
                       }

                   </div>

               </section>

               {saveSearches && (
                   <SaveSearch handleSaveSearch={(e) => handleSaveSearch(e)} loading={loadingSearch} success={success}/>
               )}
           </div>
       </Fragment>
    );
};

const mapStateToProps = (state: State) => ({
    search: state.search,
    auth: state.auth
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    addSearch: (data: any) => dispatch(addSearch(data))
})


const connector = connect(mapStateToProps, mapDispatchToProps);

type SearchProps = ConnectedProps<typeof connector>;

export default connector(memo(Search))


