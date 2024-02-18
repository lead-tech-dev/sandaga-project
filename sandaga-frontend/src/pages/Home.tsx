import React, {Fragment, FunctionComponent, memo, useEffect, useState} from "react";
import { categoriesData } from "../data/data";
import Button from "../components/Button";
import Plus from "../assets/icons/Plus";
import {useNavigate} from "react-router-dom";
import SectionTitle from "../components/section-title/section-title";
import {defaultHeaders, SEARCH_URL} from "../hooks/useConfig";
import {State} from "../redux/types";
import {connect, ConnectedProps} from "react-redux";
import {SearchIcon} from "../assets/icons/AllSvgIcon";
import RecentSearch from "../components/recent-serach/recent-search";
import ProductGlobal from "../components/product/product-global/product-global";
import CategoryContainer from "../containers/category/category";
import Skeleton from "../containers/skeleton/skeleton";
import RadioCard from "../components/radio-card/radio-card";
import {SEO} from "../components/seo";
const Home: FunctionComponent<HomeProps> = ({search: {recent}}) => {
    const navigate = useNavigate();
    const [ads, setAds] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        recentAdsApiCall()
    }, [])
    const recentAdsApiCall = () => {
        setLoading(true);
        fetch(SEARCH_URL + "/recent", {
            method: "GET",
            mode: "cors",
            headers: {
                ...defaultHeaders(),
            },
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {

                if (response.ok){
                    setAds(json)
                    setLoading(false)
                }

            })
            .catch((err) => {
                setLoading(false)
                console.log(err);
            });

    }

    return (
        <Fragment>
            <SEO title="sandaga, site de petites annonces gratuites" description="Page d'acceuil sandaga" />
            <div className="home-categories no-padding-top">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <CategoryContainer categories={categoriesData}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="banner_wrapper" onClick={() => navigate("/poster-une-annonce", {replace: true})}>
                                <div className="banner_wrapper__image">
                                    <div className="image-box">
                                        <img src="" alt=""/>
                                    </div>
                                    <div className="text-box">
                                        <h3>Commencez à gagner de l’argent</h3>
                                        <p>Donnez une seconde chance à vos objets d’occasion : vendez tout de suite ce que vous n’utilisez plus.</p>
                                    </div>
                                </div>

                                <div className="banner_wrapper__button">
                                    <Button
                                        label="Poster une Annonce"
                                        className="btn btn-primary bold"
                                        type="link"
                                        iconLeft={<Plus />}
                                        link="/poster-une-annonce"
                                        onClick={() => console.log("")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        recent.length > 0 && (
                            <div className="">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="section-header">
                                            <SectionTitle
                                                titleText="Recherches récentes"
                                                positionClass="left"
                                                spaceClass="mt-15"
                                                icon={<SearchIcon />}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    {  recent.map((item: any, index: number) => (
                                        <RecentSearch
                                            recent={item}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        )

                    }

                    <div className="product-wrapper grid-3 grid mt-40">
                        <div className="row">
                            <div className="col-12">
                                    <SectionTitle
                                        titleText="Annonces récentes"
                                        positionClass="left"
                                        spaceClass="mt-15 mb-55"
                                    />
                            </div>
                        </div>

                            {
                                loading
                                    ?
                                    <div className="row">
                                        <Skeleton size={8}/>
                                    </div>
                                    :
                                    <div className="row">
                                        { ads && ads.map((item: any, index: number) => (
                                            <ProductGlobal
                                                ads={item}
                                                display="list"
                                                index={index}
                                            />
                                        ))}
                                    </div>
                            }
                    </div>
                </div>
            </div>


        </Fragment>
    )
}
const mapStateToProps = (state: State) => ({
    search: state.search,
});


const connector = connect(mapStateToProps, null);

type HomeProps = ConnectedProps<typeof connector>;

export default connector(memo(Home))