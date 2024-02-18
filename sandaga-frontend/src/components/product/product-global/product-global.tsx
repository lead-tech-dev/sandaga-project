import React, { FunctionComponent } from "react";
import {ADS_IMAGE_URL} from "../../../hooks/useConfig";
import moment from "moment";
import 'moment/locale/fr'
import {Link, useNavigate} from "react-router-dom";
import "./product-global.style.scss"
import Button from "../../Button";
import {State} from "../../../redux/types";
import {Dispatch} from "redux";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import {addToFavorites, deleteFavorite} from "../../../redux/actions/favorites.actions";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import {getFavoriteByAdId, isFavorites} from "../../../helpers/Profile";
import placeholder from '../product-placeholder.png';
import {AuthActionTypes} from "../../../redux/types/auth.type";
interface ProductGlobalInterface{
    ads: any;
    display?: string;
    index: number;
}
const ProductGlobal: FunctionComponent<ProductGlobalProps & ProductGlobalInterface> = ({ads, display, index, auth: {credentials}, favorites: {loading, success}, addToFavorites, deleteFavorite}) => {
    moment.locale('fr')
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAddToFavorite = (e: any, adsId: string) => {
        e.preventDefault();

        if (credentials) {
            let favorite = getFavoriteByAdId(adsId, credentials["favorites"]);
            if (favorite) {
                deleteFavorite(favorite.id)
                dispatch({
                    type: AuthActionTypes.REMOVE_FAVORITE,
                    id: favorite.id
                })
            }else {
                addToFavorites(adsId);
            }
        }else {
            navigate("/login", {replace: true})
        }
    }

    const handleAdv = (e: any, id: string) => {

        if (!e.target.classList.contains("fa")) {
            navigate(`/adv/${id}`)
        }
    }

    return (
      <div className={`${display === "list" ? "col-12 col-sm-6 col-md-4 col-lg-3" : "col-12"} item`} key={index}>
               <div className={`item-wrapper  ${display === "row" && "row"}`} onClick={(e) => handleAdv(e, ads.id)}>
                   <div className={`image-wrapper ${ads.imageCount === 0 ? "no-image" : ""}`}>
                       {ads.imageCount > 0 && (
                           <div className="image-commodities">
                               <i className="fa fa-camera" />
                               <h6>{ads.imageCount}</h6>
                           </div>
                       )}

                       <Link to={`/adv/${ads.id}`} className="image">
                           {ads.imageCount > 0 ?
                               (     <LazyLoadImage width={"100%"} height={"100%"} effect="blur" className="" src={`${ADS_IMAGE_URL + ads.imageName}`} data-src="#" alt="" />
                               ) :
                               (     <img className="" src={placeholder} data-src="#" alt="" />
                               )}
                       </Link>
                       <div className="quick-actions">
                           <Button
                               className={`btn btn-circle  ${credentials && isFavorites(ads.id, credentials["favorites"]) ? "add-to-fav" : ""}`}
                               type="link"
                               onClick={(e) => handleAddToFavorite(e, ads.id)}
                               disabled={loading}
                               iconLeft={<i className="fa fa-heart" /> }
                           />
                       </div>
                   </div>
                   <div className="info-wrapper">
                       <div className="info">
                           <Link to={`/adv/${ads.id}`} className="name">
                               {ads.subject.length > 26 ? ads.subject.substring(0, 26) +"..." : ads.subject}
                           </Link>

                           <span className={`price ${ads.price_cents ? "": "no-price"}`}>
                              {ads.price_cents !== 0 && ads.price_cents + "€"}  {/*{etat && `- ${etat}`}*/}
                            </span>

                           {ads.category && <span className="category">{ads.category}</span>}
                           <span className="location">{ads.pincode.length > 25 ? ads.pincode.substring(0, 25) + "..." : ads.pincode}  {ads.city} </span>
                           <span className="posted">{moment(ads.createdAt).calendar()}</span>
                       </div>
                   </div>
               </div>
           </div>
    );
};

const mapStateToProps = (state: State) => ({
    auth: state.auth,
    favorites: state.favorites
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    addToFavorites: (adsId: string) => dispatch(addToFavorites(adsId)),
    deleteFavorite: (id: string) => dispatch(deleteFavorite(id))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ProductGlobalProps = ConnectedProps<typeof connector>;

export default connector(ProductGlobal);
