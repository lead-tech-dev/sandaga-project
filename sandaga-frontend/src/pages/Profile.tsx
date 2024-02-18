import React, {Fragment, FunctionComponent, useEffect, useRef, useState} from 'react';
import SectionTitle from "../components/section-title/section-title";
import {ADS_IMAGE_URL, defaultHeaders, SIGNUP_URL} from "../hooks/useConfig";
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import moment from "moment/moment";
import 'moment/locale/fr'
import {Dispatch} from "redux";
import {getUserFollow} from "../redux/actions/auth.actions";
import {connect, ConnectedProps} from "react-redux";
import {State} from "../redux/types";
import {isFollowing} from "../helpers/Profile";
import NoResult from "../components/no-result/no-result";
import ProductGlobal from "../components/product/product-global/product-global";
import {SEO} from "../components/seo";
import Pagination from "../components/pagination/pagination";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';


const Profile: FunctionComponent<ProfileProps> = ({auth: {authenticated, credentials, follow_loading}, getUserFollow}) => {
    const [data, setData] = useState<any>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const pageTopRef = useRef<HTMLDivElement>(null);
    const [limit, setLimit] = useState<number>(10)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page")
    const [loading, setLoading] = useState<boolean>(true);
    const param = useParams();
    const navigate = useNavigate();
    moment.locale('fr')

    useEffect(() => {
        if (param.id !== undefined && page) {
            setCurrentPage(parseInt(page))
            advApiCall(param.id, {currentPage: parseInt(page), limit})
        }else if (param.id !== undefined){
            advApiCall(param.id, {currentPage: 1, limit})
        }
    }, [param.id, page])

    const advApiCall = (userId: string, data: {currentPage: number; limit: number}) => {
        fetch(SIGNUP_URL + "/adv/" + userId, {
            method: "POST",
            mode: "cors",
            headers: {
                ...defaultHeaders(),
            },
            body: JSON.stringify(data)
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {

                if (response.ok){
                    console.log(json)
                    setData(json)
                    setTotalItems(json.relatedAds.totalItems)
                    setTotalPages(json.relatedAds.totalPages)
                    setLoading(false)
                }else {
                    setData(null);
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err);
            });

    }
  /*  const sort = [
        { label: "Tri: Plus récentes", value: "Trie: Plus récentes" },
        { label: "Tri: Plus anciennes", value: "Tri: Plus anciennes" },
        { label: "Tri: Prix croissants", value: "Tri: Prix croissants" },
        {
            label: "Tri: Prix décroissants",
            value: "Tri: Prix décroissants",
        },
    ];*/

    const handleFollow = (e: any, id: string | undefined, name: string, status: boolean) => {
        e.preventDefault();

        if (id !== undefined && authenticated) {
            getUserFollow({userFollowerId: id, name, status})
        }else {
            navigate("/login", {replace: true})
        }
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
        param && navigate(`/profile/${param.id}?page=${newPage}`, {replace: true})
        pageTopRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }



    return (
        <Fragment>
            <SEO title="Profile - Sandaga" description="Profile de l'utilisateur" />
            {loading ? "" : data ? (
                <div className="content">
                    <section className=" profile">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="view-profile public">
                                        <div className="infos">
                                            <div className="row">

                                                <div className="col-12">
                                                    <div className="actions-block">
                                                        <ul className="stack">
                                                            <li>
                            <span className="user-details-wrapper">
                              <span className="user-details">
                                <span className="user-img">
                                  <span className="avatar text-center">
                                    <LazyLoadImage width={"100%"} height={"100%"} effect="blur"
                                        src={`${data.user.image ? ADS_IMAGE_URL + data.user.image.name : "/assets/images/svg/avatar.svg"}`}
                                        alt=""
                                    />
                                  </span>
                                </span>
                                <span className="user-name">
                                  <span className="name">
                                    {data.user.firstName}
                                      <span className="verified">
                                      <i className="fa fa-check-circle"></i>{" "}
                                          Numéro de téléphone verifié
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                                                            </li>

                                                            <li>
                            <span className="joined">
                              <strong>Membre depuis le :</strong> {moment(data.user.createdAt).format('LL')}
                            </span>
                                                                {data.user.address && (
                                                                    <span className="location">
                              <i className="fa fa-map-marker"></i>{" "}
                                                                        {data.user.address.pincode}, {data.user.address.city}
                            </span>
                                                                )}
                                                                {data.user.reviews && data.user.reviews.count > 0 && (
                                                                    <>
                                                                        <div className="rating rated">
                                                                            <span>★</span>
                                                                            <span>★</span>
                                                                            <span>★</span>
                                                                            <span>★</span>
                                                                            <span>★</span>
                                                                        </div>
                                                                        <span className="reviews">({data.user.reviews.count} avis)</span>
                                                                    </>
                                                                )}
                                                            </li>
                                                            <li>
                                                                <ul className="links">

                                                                </ul>
                                                                {
                                                                    authenticated && credentials && isFollowing(param.id, credentials["followings"]) ?
                                                                    (
                                                                    <ul className="btn" onClick={(e) => handleFollow(e, param.id, credentials["firstname"], true)}>
                                                                        <li>
                                                                            <Link to={""} className={`btn btn-primary  full-width ${follow_loading ? "disabled" : ""}`}>
                                                                              Suivi(e)
                                                                            </Link>
                                                                        </li>
                                                                    </ul>
                                                                    ) : (
                                                                    <ul className="btn" onClick={(e) => handleFollow(e, param.id,  credentials["firstname"], false)}>
                                                                        <li>
                                                                            <Link to={""}  className={`btn btn-primary  full-width ${follow_loading ? "disabled" : ""}`}>
                                                                               Suivre
                                                                            </Link>
                                                                        </li>
                                                                    </ul>
                                                                    )
                                                                }
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="product-wrapper">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 col-md-9">
                                    <SectionTitle
                                        titleText={`${totalItems} annonces`}
                                        positionClass="left"
                                        spaceClass="mb-55"
                                    />
                                </div>
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        {/* <Select
                                            label="Tri: Plus récentes"
                                            options={sort}
                                            renderOption={({ option, getOptionRecommendedProps }) => (
                                                <p
                                                    {...getOptionRecommendedProps({
                                                        className: "custom",
                                                    })}
                                                >
                                                    {option.label}
                                                </p>
                                            )}
                                            customStyle="customSelectStyle"
                                        />*/}
                                    </div>
                                </div>
                            </div>
                            <div className="row row-list">
                                {data.relatedAds.ads.filter((item: any )=> item.status !== "delete").map((item: any, index: number) => (
                                    <ProductGlobal
                                        index={index}
                                        ads={item}
                                        display="row"
                                    />
                                ))}
                            </div>
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
                        </div>
                    </section>
                </div>
            ) : <NoResult link="/" msg="Retour à la page d'accueil"/>}
        </Fragment>
    )
};

const mapStateToProps = (state: State) => ({
    auth: state.auth,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    getUserFollow: (data: {userFollowerId: string, name: string, status: boolean}) => dispatch(getUserFollow(data)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ProfileProps = ConnectedProps<typeof connector>;

export default connector(Profile);