import React, { FunctionComponent } from "react";
import {ADS_IMAGE_URL} from "../../../hooks/useConfig";
import moment from "moment";
import 'moment/locale/fr'
import "./product-favorie.style.scss";
import {Link} from "react-router-dom";
import Button from "../../Button";
import placeholder from '../product-placeholder.png';
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
interface ProductFavoriteProps {
    index: number;
    loading: boolean;
    deleteFavorite: (id: string) => void;
    product: { id: string; adsId: string; subject: string; imageUrl: string; createdAt: string; categoryName?: string; categoryId: string };
    setCurrentId: Function;
    success: boolean;
}
const ProductFavorite: FunctionComponent<ProductFavoriteProps> = ({success, setCurrentId, index, loading, deleteFavorite, product: { id, adsId, imageUrl, subject, createdAt, categoryName, categoryId },}) => {

    const handleFavoriteDelete = (e: any, favoriteId: string) => {
        e.preventDefault();
        if (window.confirm(`voulez-vous vraiment supprimer ce favoris ? `)) {
            deleteFavorite(favoriteId)
            setCurrentId(favoriteId)
        }

    }
    return (
        <ul key={index} className={`item ${success ? "hide": ""}`}>
            <li className="image">
        <span className="image-holder">
            {imageUrl ?
                (     <LazyLoadImage width={"100%"} height={"100%"} effect="blur" className="lazyloaded" src={`${ADS_IMAGE_URL + imageUrl}`} data-src="#" alt="" />
                ) :
                (     <img className="lazyloaded" src={placeholder} data-src="#" alt="" />
                )}
        </span>
            </li>
            <li className="name">
                {subject && (
                    <span className="name-holder">
                        <Link to={`/adv/${adsId}`}>{subject}</Link>
          </span>
                )}
                {categoryName && (
                    <span className="name-holder">
                        <Link to={`/recherche/?category=${categoryId}`} className="category">
                          {categoryName}
                        </Link>
                  </span>
                )}
                <div className="d-lg-none">
                    <span className="data-holder">{moment(createdAt).calendar()}</span>
                </div>
            </li>
            <li className="data">
                <span className="data-holder">{moment(createdAt).calendar()}</span>
            </li>
            <li className="actions">
                <ul>
                    <li>
                        <Button
                            label="Afficher"
                            link={`/adv/${adsId}`}
                            className={`btn btn-primary`}
                            type="link"
                            onClick={(e) => console.log(e)}
                            iconLeft={<i className="fa fa-eye" /> }
                        />
                    </li>
                    <li>
                        <Button
                            label="Supprimer"
                            className={`btn btn-default`}
                            type="link"
                            onClick={(e) => handleFavoriteDelete(e, id)}
                            disabled={loading}
                            iconLeft={<i className="fa fa-trash-alt" /> }
                        />
                    </li>
                </ul>
            </li>
        </ul>
    );
};

export default ProductFavorite;
