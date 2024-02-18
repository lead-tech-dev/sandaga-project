import React, {FunctionComponent} from 'react';
import Button from "../Button";
import Close from "../../assets/icons/Close";
import "./save-search.style.scss"
import {useDispatch} from "react-redux";
import {SearchActionTypes} from "../../redux/types/search.type";
import {Link, useNavigate} from "react-router-dom";

interface SaveSearchProps {
    handleSaveSearch: (e: any) =>void;
    loading: boolean;
    success: boolean;
}
const SaveSearch: FunctionComponent<SaveSearchProps> = ({success, loading, handleSaveSearch}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClose = (e: any) => {
        e.preventDefault();

        dispatch({
            type: SearchActionTypes.SEARCH_ERROR,
            errors: null
        })
    }

    const handleOnClick = (e: any) => {
        e.preventDefault();

        navigate("/dashboard/mes-recherches", {replace: true})

        dispatch({
            type: SearchActionTypes.SEARCH_ERROR,
            errors: null
        })
    }
    return(
      <div className="save-search-wrapper">
          {success && (
              <div className="save-search-wrapper__body">
                  <div className="message">
                      <div className="text">
                          <p>Votre recherche est sauvegardée !</p>
                      </div>
                      <div className="link">
                          <Link to="#@" onClick={handleOnClick}>Voir mes recherches</Link>
                      </div>
                  </div>
                  <Close onClick={(e) => handleClose(e)} />
              </div>
          )}
          <div className="save-search-wrapper__btn">
              <Button
                  label="Sauvegarder la recherche"
                  className={`btn btn-primary bell`}
                  type="link"
                  onClick={(e) => handleSaveSearch(e)}
                  disabled={loading}
                  iconLeft={<i className="fa fa-bell" /> }
              />
          </div>
      </div>
    );
}

export default SaveSearch;