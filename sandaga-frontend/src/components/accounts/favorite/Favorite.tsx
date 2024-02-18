import React, {Fragment, FunctionComponent, useEffect, useRef, useState} from 'react';
import ProductFavorite from "../../product/product-favorite/product-favorite";
import {State} from "../../../redux/types";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import NoResult from "../../no-result/no-result";
import {Dispatch} from "redux";
import {deleteFavorite} from "../../../redux/actions/favorites.actions";
import {GlobalsActionTypes} from "../../../redux/types/globals.type";
import {AuthActionTypes} from "../../../redux/types/auth.type";
import {useNavigate, useSearchParams} from "react-router-dom";
import {FAVORITES_URL, headersWithAuthorization, SIGNUP_URL} from "../../../hooks/useConfig";
import Pagination from "../../pagination/pagination";

const Favorite: FunctionComponent<FavoriteProps> = ({auth: {credentials}, favorites: {loading, success, errors}, deleteFavorite}) => {
    const [favorites, setFavorites] = useState<any>(null)
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const pageTopRef = useRef<HTMLDivElement>(null);
    const [limit, setLimit] = useState<number>(10)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [currentId, setCurrentId] = useState<string | null>(null)
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page")
    const [loadingFavotite, setLoadingFavorites] = useState<boolean>(true)
    const navigate = useNavigate();
    useEffect(() => {
        if (page) {
            setCurrentPage(parseInt(page))
            credentials && userFavoritesApiCall({currentPage: parseInt(page), limit});
        }else {
            setCurrentPage(1)
            credentials && userFavoritesApiCall({currentPage: 1, limit});
        }
    }, [page])

    useEffect(() => {
        if (success) {
            dispatch({
                type: AuthActionTypes.REMOVE_FAVORITE,
                id: currentId
            })
            dispatch({
                type: GlobalsActionTypes.CLEAR_ERRORS
            })

            let filtersFavorites = favorites && favorites.filter((item: any) => item.id !== currentId);
            setFavorites(filtersFavorites);

        }
    }, [success]);

    const userFavoritesApiCall = (data: {currentPage: number; limit: number}) => {
        setLoadingFavorites(true);
        fetch(FAVORITES_URL+ "/list" , {
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
                    setFavorites(json.favorites)
                    setTotalItems(json.totalItems)
                    setTotalPages(json.totalPages)

                    setLoadingFavorites(false)
                }else {
                    setFavorites(null)
                    setLoadingFavorites(false)
                }
            })
            .catch((err) => {
                setLoadingFavorites(false)
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
        navigate(`/dashboard/mes-favoris?page=${newPage}`, {replace: true})
        pageTopRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }

    console.log(favorites)
    return(
        <div className="product-favorite-wrapper">
            <ul className="table-sheet favorite">
                {loadingFavotite ? "" : favorites  && favorites.length > 0 ? (
                    <Fragment>
                        <li>
                            <ul>
                                <li className="image">
                                    <a href="src/components/accounts#">
                                        Image <i className="fas fa-angle-down"></i>
                                    </a>
                                </li>
                                <li className="name">
                                    <a href="src/components/accounts#">
                                        Titre <i className="fas fa-angle-down"></i>
                                    </a>
                                </li>
                                <li className="data">
                                    <a href="src/components/accounts#">
                                        Date <i className="fas fa-angle-down"></i>
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
                            {favorites && favorites.map((item: any, index: number) => {
                                return(
                                    <ProductFavorite
                                        product={item}
                                        deleteFavorite={deleteFavorite}
                                        loading={loading}
                                        index={index}
                                        setCurrentId={setCurrentId}
                                        success={success}
                                    />
                                )
                            }

                            )}
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
                ):  <NoResult link="/recherche" icon="heart" msg="Continuer" text="Vous n'avez pas de favoris enregistré!"/>}

            </ul>
        </div>
    );
}
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    deleteFavorite: (id: string) => dispatch(deleteFavorite(id))
});
const mapStateToProps = (state: State) => ({
    auth: state.auth,
    favorites: state.favorites
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type FavoriteProps = ConnectedProps<typeof connector>;

export default connector(Favorite);