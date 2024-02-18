import React, {Fragment, FunctionComponent, useEffect, useRef, useState} from 'react';
import ProductSearch from "../../product/product-search/product-search";
import {Dispatch} from "redux";
import {State} from "../../../redux/types";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import {deleteSearch} from "../../../redux/actions/search.actions";
import {headersWithAuthorization, SEARCHES_URL, SIGNUP_URL} from "../../../hooks/useConfig";
import NoResult from "../../no-result/no-result";
import {SearchActionTypes} from "../../../redux/types/search.type";
import {AuthActionTypes} from "../../../redux/types/auth.type";
import {useNavigate, useSearchParams} from "react-router-dom";
import Pagination from "../../pagination/pagination";


const Searches: FunctionComponent<SearchesProps> = ({search: {success, loading: loadingDelete}, auth: {credentials}, deleteSearch}, ) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [searches, setSearches] = useState<any>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const pageTopRef = useRef<HTMLDivElement>(null);
    const [limit, setLimit] = useState<number>(10)
    const [totalItems, setTotalItems] = useState<number>(0)
    const count = useRef(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page")

    useEffect(() => {
        if (success) {
            setTimeout(() => {
              //  Object.keys(credentials).length > 0 && userSearchApiCall();
                //const localSearches = searches.filter((item: any) => item.id !== currentId);
                //setSearches(localSearches);

                dispatch({
                    type: AuthActionTypes.REMOVE_SEARCHES,
                    id: currentId
                })
                dispatch({ type: SearchActionTypes.SEARCH_ERROR, errors: null });

                let filtersSearches = searches && searches.filter((item: any) => item.id !== currentId);
                setSearches(filtersSearches);

            }, 500);
        }
    }, [success])

    useEffect(() => {
        if (page) {
            setCurrentPage(parseInt(page))
            credentials && userSearchApiCall({currentPage: parseInt(page), limit});
        }else {
            setCurrentPage(1)
            credentials && userSearchApiCall({currentPage: 1, limit});
        }

    }, [page])
    const userSearchApiCall = (data: {currentPage: number, limit: number}) => {
        setLoading(true);
        fetch(SEARCHES_URL + "/user" , {
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
                    setSearches(json.searches)
                    setTotalItems(json.totalItems)
                    setTotalPages(json.totalPages)
                    setLoading(false)
                }else {
                    setSearches(null)
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err);
            });

    }

    const onNextPageClick = (e: any) => {
        e.preventDefault();
        const newPage =  Math.min(currentPage + 1, totalPages);

        console.log(newPage)

        handleChangePage(newPage)
    }

    const onPrevPageClick = (e: any) => {

        const newPage = Math.max(currentPage - 1, 1);

        handleChangePage(newPage)
    }

    const handleChangePage = (newPage: number) => {
        navigate(`/dashboard/mes-recherches?page=${newPage}`, {replace: true})
        pageTopRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }

    console.log(searches)
    return(
        <div className="account-listing ">
            <ul className="table-sheet list-favorite">
                {loading ? "" : searches && searches.length > 0 ? (
                    <Fragment>
                        <li>
                            <ul>
                                <li className="image">
                                    <a href="src/components/accounts#">
                                         <i className="fas fa-angle-down"></i>
                                    </a>
                                </li>
                                <li className="name">
                                    <a href="src/components/accounts#">
                                         <i className="fas fa-angle-down"></i>
                                    </a>
                                </li>
                                <li className="data">
                                    <a href="src/components/accounts#">
                                         <i className="fas fa-angle-down"></i>
                                    </a>
                                </li>
                                <li className="actions">
                                    <a href="src/components/accounts#">
                                        <i className="fas fa-database"></i>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            {searches.map((item: any, index: number) => (
                                <ProductSearch
                                    searches={item}
                                    deleteSearch={deleteSearch}
                                    loading={loadingDelete}
                                    index={index}
                                    setCurrentId={setCurrentId}
                                />
                            ))}
                        </li>
                        {
                            totalPages > 1 && (
                                <div className="row mt-5">
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
                ): <NoResult link="/" icon="search-plus" msg="Continuer" text="Vous n'avez pas de recherche enregistrée!"/>}
            </ul>
        </div>
    );
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    deleteSearch: (id: string) => dispatch(deleteSearch(id))
});
const mapStateToProps = (state: State) => ({
    auth: state.auth,
    search: state.search
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type SearchesProps = ConnectedProps<typeof connector>;

export default connector(Searches);