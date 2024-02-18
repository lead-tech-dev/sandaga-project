import React, {FunctionComponent, useCallback, useEffect, useRef, useState} from "react";
import Favoris from "../../assets/icons/Favoris";
import Messagerie from "../../assets/icons/Messagerie";
import User from "../../assets/icons/User";
import Button from "../Button";
import Plus from "../../assets/icons/Plus";
import { State } from "../../redux/types";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import { GlobalsActionTypes } from "../../redux/types/globals.type";
import SearchBox from "../search-box/SearchBox";
import {SearchActionTypes} from "../../redux/types/search.type";
import {createQueryParams, getUrls} from "../../helpers/Poster";
import {storeFilters} from "../../helpers/Search";
import {RecentSearchInterface} from "../../redux/reducers/search.reducer";
import {getToken, tokenExpired} from "../../hooks/useConfig";
import {Dispatch} from "redux";
import {getAuthUserData, refreshExpiredToken} from "../../redux/actions/auth.actions";

const Header: FunctionComponent<HeaderProps> = ({
  auth: { authenticated, credentials },  refreshExpiredToken, getAuthUserData
}) => {
  const [recent, setRecent] = useState<RecentSearchInterface>({filters: {criteria: {ad_type: "sell"}}, limit: 20, order: "desc", sort: "time", currentPage: 1}, );

  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [keyword, setKeyword] = useState<string>("")
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const intervalRef = useRef<any>(null);
  const getRefreshToken = useCallback(() => {refreshExpiredToken()}, [])
  let token = getToken();

  useEffect(() => {
    if (token) {
      getAuthUserData();
      let interval = setInterval(() => {
        if (tokenExpired()) {
         console.log("token expired")
          refreshExpiredToken();
        } else {
          console.log("token not expired")
        }
      intervalRef.current = interval;

      }, 5000)
    } else {
      //console.log("clear interval")
      clearInterval(intervalRef.current)
    }
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [token]);


  useEffect(() => {
    const header = document.querySelector<any>(".main-menu-wrapper");
    setHeaderTop(header?.offsetTop);
    window.addEventListener("scroll", handleScroll);

    //inputRef.current?.focus();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (searchParams) {
      let urls = getUrls(searchParams);

      let recents = storeFilters(recent, urls);

      setRecent(recents)
    }

  }, [searchParams]);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  const handleClick = (e: any) => {
    //e.currentTarget.nextSibling.classList.toggle("show");
    navigate("/contact", {replace: true})
  };
  const handleCancel = () => {
    navigate("/", { replace: true });
    dispatch({ type: GlobalsActionTypes.CLEAR_ERRORS });
  };
  const handleSearchInput = (text: string) => {
    if (text.length === 0) {
        searchParams.delete("text")
        setSearchParams(searchParams)
    }
    setKeyword(text)
  };
  const handleSelectedResult = (value: string, category: string) => {
    const query = new URLSearchParams(location.search);
    let urls = getUrls(query);

    urls.category = category;
    urls.text = value;

    let queryString = createQueryParams(urls, recent);


    navigate(`/recherche?${queryString}`, {replace: true})

    setKeyword(value)

    let store = storeFilters(recent, urls);

    if (store.filters.keywords || store.filters.location || (store.filters.criteria && Object.keys(store.filters.criteria).length > 1)) {
      dispatch({
        type: SearchActionTypes.ADD_LOCATION,
        payload: store
      })
    }

  };


  function handleClickSearchButton() {
    let urls = {};

    urls = {...urls, text: keyword};

    let queryString = createQueryParams(urls, recent);

    navigate(`/recherche?${queryString}`, {replace: true})

    let store = storeFilters(recent, urls);

    if (store.filters.keywords || store.filters.location || (store.filters.criteria && Object.keys(store.filters.criteria).length > 1)) {
      dispatch({
        type: SearchActionTypes.ADD_LOCATION,
        payload: store
      })
    }
  }

  return (
    <header className="header floating">
      <div className="top-bar">
        <div className="container">
          <div className="row justify-content-center align-self-center h-100">
            <div className="col-6 col-md-5 ">

              <div className="btn-group location">
                <button
                  type="button"
                  className="btn dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  onClick={(e) => handleClick(e)}
                  style={{fontWeight: 700}}
                >
                  Contactez-nous
                </button>
              {/*  <div className="dropdown-menu">
                  <a href="#">Canada</a>
                  <a href="#">Mexico</a>
                  <a href="#">Japan</a>
                  <a href="#">Australia</a>
                </div>*/}
              </div>
            </div>
            <div className="col-6 col-md-7 my-auto text-right">
              <ul>
                <li>
                  <i className="fa fa-envelope" />{" "}
                  <a href="#">sandaga@info.com</a>
                </li>
                <li>
                  <i className="fa fa-phone" /> <a href="#">06 51 37 23 94</a>
                </li>
              </ul>
              <div className="btn-group language">
                <button
                  type="button"
                  className="btn dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  onClick={(e) => handleClick(e)}
                >
                  <span className="fi fi-fr" /> FR
                </button>
                <div className="dropdown-menu">
                  <a href="#">
                    <span className="flag flag-fra" /> FR
                  </a>
                {/*  <a href="#">
                    <span className="flag flag-ita" /> IT
                  </a>
                  <a href="#">
                    <span className="flag flag-esp" /> ES
                  </a>
                  <a href="#">
                    <span className="flag flag-deu" /> DE
                  </a>*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`main-menu-wrapper ${
          scroll > headerTop ? "sticky-nav" : ""
        }`}
      >
        <nav>
          <div className="main-menu">
            <div className="container">
              <div className="row">
                <div className={`${location.pathname === "/poster-une-annonce" ? "col-sm-6": "col-sm-2"} col-md-2 `}>
                  {/*<div className="hamburger">
                    <Link to="/">
                      <span>
                        <span />
                      </span>
                    </Link>
                  </div>*/}
                  <div className="logo">
                    <Link to="/">
                      <img src="/assets/images/logo.png" alt="buyamSellam" />
                    </Link>
                  </div>
                </div>
                {location.pathname === "/poster-une-annonce" && (
                  <div className="col-0 col-md-6 d-none d-lg-block">
                    <div className="heading">
                      <h2>Poster une annonce</h2>
                    </div>
                  </div>
                )}
                {location.pathname !== "/poster-une-annonce" && (
                  <>
                    <div className={`col-0 col-sm-7 col-lg-5 ${
                      location.pathname.split("/")[1] === "dashboard" 
                          ? "no-search-bar" : ""}`}>
                      <SearchBox
                          style={{
                            width: "100%",
                            paddingBottom: "10px",
                            paddingTop: "13px",
                            //boxShadow: '0 11px 30px rgba(0,0,0,0.05)',
                            borderRadius: '4px',
                            //overflow: 'hidden',
                          }}
                          handleSearch={(value: string) => handleSearchInput(value)}
                          handleSelectedResult={(value: string, category: string) => handleSelectedResult(value, category)}
                          value={keyword || ''}
                          onClick={handleClickSearchButton}
                          className="banner-search"
                          pathname={"pathname"}
                          bordered={true}
                          suggestions={["Tella", "Maximan"]}
                          autoSuggestion={true}
                      />
                    </div>

                    <div className="col-0 col-sm-3 col-lg-5">
                      { authenticated && credentials ? (
                          <div className="right-block text-right">
                            <Button
                                className="btn d-lg-none"
                                type="link"
                                iconLeft={<Favoris />}
                                link="/dashboard/mes-favoris"
                                onClick={() => console.log("")}
                            />
                            <Button
                                className="btn d-lg-none"
                                type="link"
                                iconLeft={<Messagerie />}
                                link="/dashboard/mes-messages"
                                onClick={() => console.log("")}
                            />

                            <Button
                                className="btn d-lg-none"
                                type="link"
                                iconLeft={<User />}
                                link="/dashboard"
                                onClick={() => console.log("")}
                            />

                            <div className="btn-group d-none d-lg-block">
                              <Button
                                  label="Favoris"
                                  className="btn dropdown-toggle"
                                  type="link"
                                  iconLeft={<Favoris />}
                                  favoriteCount={credentials["favorites"]}
                                  link="/dashboard/mes-favoris"
                                  onClick={() => console.log("")}
                              />
                            </div>

                            <div className="btn-group d-none d-lg-block">
                              <Button
                                  label="Messages"
                                  className="btn dropdown-toggle"
                                  type="link"
                                  iconLeft={<Messagerie />}
                                  messageCount={credentials["chatsMessagePendingNumber"]}
                                  link="/dashboard/mes-messages"
                                  onClick={() => console.log("")}
                              />
                            </div>
                            <div className="btn-group d-none d-lg-block">
                              <Button
                                  label={credentials && credentials["firstname"]}
                                  className="btn dropdown-toggle"
                                  type="link"
                                  iconLeft={<User />}
                                  link="/dashboard"
                                  onClick={() => console.log("")}
                              />
                            </div>

                            <Button
                                label="Poster une Annonce"
                                className="btn btn-primary bold"
                                type="link"
                                iconLeft={<Plus />}
                                link="/poster-une-annonce"
                                onClick={() => console.log("")}
                            />
                          </div>
                      ) : (
                          <div className="right-block text-right">
                            <Button
                                className="btn d-lg-none"
                                type="link"
                                iconLeft={<Favoris />}
                                link="/dashboard/mes-favoris"
                                onClick={() => console.log("")}
                            />
                            <Button
                                className="btn d-lg-none"
                                type="link"
                                iconLeft={<Messagerie />}
                                link="/dashboard/mes-messages"
                                onClick={() => console.log("")}
                            />

                            <Button
                                className="btn d-lg-none"
                                type="link"
                                iconLeft={<User />}
                                link="/login"
                                onClick={() => console.log("")}
                            />

                            <div className="btn-group d-none d-lg-block">
                              <Button
                                  label="Favoris"
                                  className="btn dropdown-toggle"
                                  type="link"
                                  iconLeft={<Favoris />}
                                  link="/dashboard/mes-favoris"
                                  onClick={() => console.log("")}
                              />
                            </div>

                            <div className="btn-group d-none d-lg-block">
                              <Button
                                  label="Messages"
                                  className="btn dropdown-toggle"
                                  type="link"
                                  iconLeft={<Messagerie />}
                                  link="/dashboard/mes-messages"
                                  onClick={() => console.log("")}
                              />
                            </div>
                            <div className="btn-group d-none d-lg-block">
                              <Button
                                  label="Connexion"
                                  className="btn dropdown-toggle"
                                  type="link"
                                  iconLeft={<User />}
                                  link="/login"
                                  onClick={() => console.log("")}
                              />
                            </div>

                            <Button
                                label="Poster une Annonce"
                                className="btn btn-primary bold"
                                type="link"
                                iconLeft={<Plus />}
                                link="/poster-une-annonce"
                                onClick={() => console.log("")}
                            />
                          </div>
                      )}

                    </div>
                  </>
                )}

                {location.pathname === "/poster-une-annonce" && (
                  <div className="col-sm-6 col-md-10 col-lg-4">
                    <div className="btn-cancel">
                      <Button
                        label="Annuler"
                        className="btn-canceled right"
                        type="button"
                        onClick={() => handleCancel()}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

const mapStateToProps = (state: State) => ({
  auth: state.auth,
  search: state.search,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  refreshExpiredToken: () => dispatch(refreshExpiredToken()),
  getAuthUserData: () => dispatch(getAuthUserData()),
});


const connector = connect(mapStateToProps, mapDispatchToProps);

type HeaderProps = ConnectedProps<typeof connector>;

export default connector(Header);