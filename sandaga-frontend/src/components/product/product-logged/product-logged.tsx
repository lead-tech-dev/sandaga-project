import React, { Fragment, FunctionComponent, MouseEvent } from "react";
import {ADS_IMAGE_URL} from "../../../hooks/useConfig";
import {Link, useLocation} from "react-router-dom";
import moment from "moment";
import 'moment/locale/fr'
import "./product-logged.style.scss"
import Button from "../../Button";
import placeholder from '../product-placeholder.png';
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ProductLoggedProps {
    index: number;
    ads: any;
    deleteAds: (id: string) => void;
    loading: boolean;
    setCurrentAdId: Function;
}

const ProductLogged: FunctionComponent<ProductLoggedProps> = ({setCurrentAdId, ads, deleteAds, loading, index}) => {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        e.currentTarget.parentElement?.parentElement?.parentElement?.nextElementSibling?.firstElementChild?.classList.toggle(
            "collapse"
        );

        // open?.classList.toggle("collapse");
    };

    const handleAdsDelete = (e: any, adsId: string) => {
        e.preventDefault();
         if (window.confirm(`voulez-vous vraiment supprimer cette annonce ? `)) {
             deleteAds(adsId)
             setCurrentAdId(adsId);
         }

    }

    return (
        <Fragment>
            <ul key={index}>
                <li className="image">
          <span className="image-holder">
                {ads.imageCount > 0 ?
                    (     <LazyLoadImage width={"100%"} height={"100%"} effect="blur"  className="lazyloaded" src={`${ADS_IMAGE_URL + ads.imageName}`} data-src="#" alt="" />
                    ) :
                    (     <img className="lazyloaded" src={placeholder} data-src="#" alt="" />
                    )}

          </span>
                </li>
                <li className="name">
          <span className="name-holder">
            <Link to={`/adv/${ads.id}`}>
                {ads.subject.length > 26 ? ads.subject.substring(0, 26) +"..." : ads.subject}
            </Link>
          </span>
                    <div className="d-lg-none">

                        <span className="category-holder">
              <Link to={`/adv/${ads.id}`}>{ads.category}</Link>
            </span>


                    </div>
                </li>
                <li className="data">
          <span className="data-holder">
            <i className="fa fa-clock" />
              {moment(ads.createdAt).calendar()}
          </span>
                </li>
                <li className="category">
          <span className="category-holder">
            <a href="src/components/product#">{ads.category}</a>
          </span>
                </li>
                <li className="status">
                    {ads.status === "delete" && (
                        <span className="status-holder expired">
              <i className="fa fa-trash-alt" /> Suprimée
            </span>
                    )}

                    {ads.status === "active" && (
                        <span className="status-holder active">
              <i className="fa fa-calendar-check" /> Active
            </span>
                    )}

                    {ads.status === "inactive" && (
                        <span className="status-holder inactif">
              <i className="fa fa-calendar-minus" /> Inactive
            </span>
                    )}
                </li>
                <li className="actions">
                    <ul>
                        <li>
                            <Button
                                label="Modifier"
                                link={`${ads.id}/edit`}
                                className={`btn btn-primary`}
                                type="link"
                                onClick={(e) => console.log(e)}
                                iconLeft={<i className="fa fa-edit" /> }
                            />
                        </li>
                        <li>
                            <Button
                                label="Supprimer"
                                className={`btn btn-default`}
                                type="link"
                                onClick={(e) => handleAdsDelete(e, ads.id)}
                                disabled={loading}
                                iconLeft={<i className="fa fa-trash-alt" /> }
                            />

                        </li>
                        <li>
                            <Button
                                label="Stats"
                                className={`btn btn-secondary`}
                                type="link"
                                onClick={(e) => handleClick(e)}
                                iconLeft={<i className="fa fa-chart-line" /> }
                            />

                        </li>
                    </ul>
                </li>
                <li className="stats">
                    <div id="" className="stats-block collapse" aria-expanded="false">
                        <ul>
                            <li>
                                Vues: <i className="fa fa-eye" /> { ads.stats.views }
                            </li>
                            {/* <li>
                Partagée sur: <i className="fab fa-facebook-square" /> 100
                &nbsp; <i className="fab fa-twitter-square" /> 14 &nbsp;{" "}
                <i className="fa fa-envelope" /> 5
              </li> */}
                            <li>
                                Ajoutée aux Favoris: <i className="fa fa-heart" /> { ads.stats.favorites }
                            </li>
                            <li>
                                Messages: <i className="fa fa-envelope-square" /> { ads.stats.messages }
                            </li>

                            <li>
                                Appels: <i className="fa fa-phone-square" /> { ads.stats.calls }
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </Fragment>
    );
};

export default ProductLogged;
