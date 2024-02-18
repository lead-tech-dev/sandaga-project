import React, {Fragment, FunctionComponent, useEffect, useReducer, useRef, useState} from 'react';
import ProductLogged from "../../product/product-logged/product-logged";
import {headersWithAuthorization, SIGNUP_URL} from "../../../hooks/useConfig";
import {State} from "../../../redux/types";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import NoResult from "../../no-result/no-result";
import {filterAds} from "../../../helpers/Profile";
import {Outlet, useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Dispatch} from "redux";
import {deleteAds} from "../../../redux/actions/ads.actions";
import {GlobalsActionTypes} from "../../../redux/types/globals.type";
import Pagination from "../../pagination/pagination";



const Ads: FunctionComponent<AdsProps> = ({auth: {credentials}, adsData: {success, loading: loadingDelete, postedAd}, deleteAds}) => {
    const [ads, setAds] = useState<any>(null);
    const [adsFilters, setAdsFilters] = useState<any>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const pageTopRef = useRef<HTMLDivElement>(null);
    const [limit, setLimit] = useState<number>(10)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<string>("all");
    const [currentAdId, setCurrentAdId] = useState<string | null>(null)
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const param = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page")


    useEffect(() => {

        if (page) {
            setCurrentPage(parseInt(page))
            credentials && userAdsApiCall({currentPage: parseInt(page), limit});
        }else {

            setCurrentPage(1)
            credentials && userAdsApiCall({currentPage: 1, limit});
        }
    }, [page, postedAd])


    useEffect(() => {
        if (success) {
            setTimeout(() => {
                //credentials && userAdsApiCall();
                let filtersAds = adsFilters.filter((item: any) => item.id !== currentAdId);
                setAdsFilters(filtersAds);
                dispatch({ type: GlobalsActionTypes.CLEAR_ERRORS });
            }, 500);
        }
    }, [success])

    const userAdsApiCall = (data: {currentPage: number; limit: number}) => {

        setLoading(true);
        fetch(SIGNUP_URL + "/ads" , {
            method: "POST",
            mode: "cors",
            headers: {
                ...headersWithAuthorization(),
            },
            body: JSON.stringify(data)
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {

                if (response.ok){
                    setAds(json.ads)
                    setAdsFilters(json.ads)
                    setTotalItems(json.totalItems)
                    setTotalPages(json.totalPages)

                    setLoading(false)
                }else {
                    setAds(null)
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err);
            });

    }

    const handleStatusChange = (e: any, status: string, adsData: any) => {
        e.preventDefault();

        let filter = filterAds(adsData, status);
        setAdsFilters(filter)
    }

    const onNextPageClick = (e: any) => {
        e.preventDefault();
        const newPage =  Math.min(currentPage + 1, totalPages);

        handleChangePage(newPage)
    }

    const onPrevPageClick = (e: any) => {

        const newPage = Math.max(currentPage - 1, 1);

        handleChangePage(newPage)
    }

    const handleChangePage = (newPage: number) => {
        navigate(`/dashboard/mes-annonces?page=${newPage}`, {replace: true})
        pageTopRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }

    return(
        <Fragment >
            {param.adsId === undefined ? (
                <div className="product-logged-wrapper" ref={pageTopRef}>
                    <ul className="table-sheet ads">
                        {loading ? "" : ads && ads.length > 0 ? (
                            <Fragment>
                                <li>
                                    <ul>
                                        <li className="name">
                                            <a href="#@" onClick={(e) => handleStatusChange(e,"all", ads)}>
                                                Tous <i className="fas fa-angle-down" />
                                            </a>
                                        </li>
                                        <li className="data">
                                            <a href="#@" onClick={(e) =>  handleStatusChange(e,"active", ads)}>
                                                Active <i className="fas fa-angle-down" />
                                            </a>
                                        </li>
                                        <li className="category">
                                            <a href="#@" onClick={(e) => handleStatusChange(e,"delete", ads)}>
                                                Supprimée <i className="fas fa-angle-down" />
                                            </a>
                                        </li>
                                        <li className="status">
                                            <a href="#@" onClick={(e) => handleStatusChange(e,"inactive", ads)}>
                                                Inactive <i className="fas fa-angle-down" />
                                            </a>
                                        </li>
                                        <li className="actions">
                                            <a href="src/components/accounts#">
                                                <i className="fas fa-database" />
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    {adsFilters.length > 0 ? adsFilters.map((item: any, index: number) => (
                                        <ProductLogged
                                            deleteAds={deleteAds}
                                            ads={item}
                                            loading={loadingDelete}
                                            index={index}
                                            setCurrentAdId={setCurrentAdId}
                                        />
                                    )) : <p style={{textAlign: "center"}}>Aucune annonce disponible</p>}
                                </li>
                                {
                                    totalPages > 1 && (
                                        <div className="row">
                                            <div className="col-12 text-center">
                                                <Pagination
                                                    pageCount={totalPages}
                                                    nextPage={(e) => onNextPageClick(e)}
                                                    prevPage={(e) => onPrevPageClick(e)}
                                                    setPage={(page) => handleChangePage(page)}
                                                    currentPage={currentPage}/>
                                            </div>
                                        </div>
                                    )
                                }
                            </Fragment>
                        ): <NoResult link="/poster-une-annonce" icon="product-hunt" msg="Poster une annonce" text="Vous n'avez poster aucune annonce "/>}
                    </ul>
                </div>
            ): (
                <Outlet/>
            )}
        </Fragment>
    );
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    deleteAds: (id: string) => dispatch(deleteAds(id))
});

const mapStateToProps = (state: State) => ({
    auth: state.auth,
    adsData: state.adsData,
});



const connector = connect(mapStateToProps, mapDispatchToProps);

type AdsProps = ConnectedProps<typeof connector>;

export default connector(Ads)