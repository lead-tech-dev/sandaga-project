import React, {Fragment, FunctionComponent, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {categoriesData, criteriaData} from "../data/data";
import ArrowRight from "../assets/icons/ArrowRight";
import SectionTitle from "../components/section-title/section-title";
import LightboxImage from "../components/lightbox/lightbox-image/lightbox-image";
import {BreadcrumbsItem} from "react-breadcrumbs-dynamic";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import {convertCriteria, getCategoryCriteria, getSubCategoryById} from "../helpers/Poster";
import Location from "../assets/icons/Location";
import Mapview from "../components/marker/mapview";
import Shipping from "../components/shipping/shipping";
import {ADS_IMAGE_URL, CHAT_URL, defaultHeaders, headersWithAuthorization, SEARCH_URL} from "../hooks/useConfig";
import moment from "moment";
import 'moment/locale/fr'
import NoResult from "../components/no-result/no-result";
import ProductGlobal from "../components/product/product-global/product-global";
import LightboxReply from "../components/lightbox/lightbox-reply/lightbox-reply";
import {State} from "../redux/types";
import {Dispatch} from "redux";
import {connect, ConnectedProps} from "react-redux";
import {FormDataInterface, RulesInterface} from "../interfaces/form.interface";
import {createChat} from "../redux/actions/chat.actions";
import placeholder from "../components/product/placeholder-lg.png";
import {SEO} from "../components/seo";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
const Adv: FunctionComponent<AdvProps> = ({auth: {credentials}, chat: {chat_loading, errors, success}, createChat}) => {
    const [adv, setAdv] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [reply, setReply] = useState<boolean>(false);
    const [formErrRegexp, setFormErrRegexp] = useState<FormDataInterface>({message: ""});
    const [formData, setFormData] = useState<FormDataInterface | null>(null)
    const [showNumber, setShowNumber] = useState<boolean>(false);
    const [existsChat, setExistsChat] = useState<{exists: boolean; chatId: string} | null>(null);
   const [existsChatLoading, setExistsChatLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const param = useParams();
    moment.locale('fr')

    useEffect(() => {
       if (param.id !== undefined) {
           advApiCall(param.id)
       }

    }, [param.id])

    useEffect(() => {
        if (adv) {
          credentials &&  existsChatApiCall(adv.ads.user.id, credentials["userId"], adv.ads.id);
        }
    }, [adv]);

    useEffect(() => {
        if (success) {
            setExistsChat((prevState) => prevState && ({...prevState, exists: true}));
        }
    }, [success]);


    const existsChatApiCall = (receiver: string, sender: string, ads: string) => {
        setExistsChat(null)
        fetch(CHAT_URL + "/exists", {
            method: "POST",
            mode: "cors",
            headers: {
                ...headersWithAuthorization(),
            },
            body: JSON.stringify({receiver, sender, ads})
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {

                if (response.ok){
                    setExistsChat(json)
                    setExistsChatLoading(false)
                }else {
                    setExistsChat(null)
                    setExistsChatLoading(false)
                }
            })
            .catch((err) => {
                setExistsChatLoading(false)
                console.log(err);
            });

    }
    const advApiCall = (adsId: string) => {
        fetch(SEARCH_URL + "/adv/" + adsId, {
            method: "POST",
            mode: "cors",
            headers: {
                ...defaultHeaders(),
            },
            body: JSON.stringify({currentPage: 1, limit: 4})
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {

                if (response.ok){
                    setAdv(json)
                    console.log(json)
                    setLoading(false)
                }else {
                    setAdv(null)
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err);
            });

    }
    const handleLightBox = () => {
        const lightbox = document.querySelector(".lightbox-image");

        lightbox?.classList.toggle("open");
    };
    const handleLightBoxReply = (e: any) => {
        e.preventDefault();
        setReply((prevState) => !prevState)
        if (credentials) {
            const lightbox = document.querySelector(".lightbox-reply");
            lightbox?.classList.toggle("open");
        }else {
            navigate("/login", {replace: true})
        }
    };
    const handleChange = (e: any, rules: RulesInterface) => {
        const {name, value} = e.target;
        const regex = new RegExp(rules.regexp);

        if (regex && regex.test(value)) {
            setFormErrRegexp((prevState) => ({...prevState, [name]: ""}));

            setFormData((prevState) => ({...prevState, [name]: value}))


        } else {
            setFormErrRegexp((prevState) => ({...prevState, [name]: rules.err_regexp}));

            setFormData((prevState) => ({...prevState, [name]: value}))
        }

    }
    const handleBlur = (e: any, rules: RulesInterface) => {
        const {name, value} = e.target;

        if (formData  && formData[name as keyof FormDataInterface]  === "") {
            setFormErrRegexp((prevState) => ({...prevState, [name]: rules.err_mandatory}));
            setFormData((prevState) => ({...prevState, message: value}))
        }
    };
    const handleSubmit = (e: any, rules: RulesInterface, adId: string, userId: string) => {
        e.preventDefault();

          if(formData && formData["message"] === "") {
                setFormErrRegexp((prevState) => ({...prevState, message: rules.err_mandatory}));
            }

        if (formData && credentials) {
            formData.ads = adId;
            formData.receiver = userId;
            formData.dest = userId;
            formData.owner = credentials["userId"];
            formData.sender = credentials["userId"];

            createChat({ads: formData.ads, receiver: formData.receiver, sender: formData.sender, owner: formData.owner, dest: formData.dest, message: formData.message})
        }
        setFormData((prevState) => ({...prevState, message: ""}))

        //console.log(formData)
    }

    return (
        <Fragment>
            <SEO title={adv?.ads.category.name + " - Sandaga"} description="Nom de la categorie" />
            {loading ? "" :
                adv ? (
                    <>
                        <BreadcrumbsItem to={process.env.PUBLIC_URL + '/'}>Accueil</BreadcrumbsItem>
                        <BreadcrumbsItem to={process.env.PUBLIC_URL + `/recherche?category=${getSubCategoryById(categoriesData, adv.ads.category.id).category.id}`}>{getSubCategoryById(categoriesData, adv.ads.category.id).category.name}</BreadcrumbsItem>
                        <BreadcrumbsItem to={process.env.PUBLIC_URL + `/recherche?category=${adv.ads.category.id}`}>{adv.ads.category.name}</BreadcrumbsItem>
                        <BreadcrumbsItem to={process.env.PUBLIC_URL + `/recherche?category=${adv.ads.category.id}/${adv.ads.subject}`}>{adv.ads.subject}</BreadcrumbsItem>

                        <section className="view-listing-wrapper">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="">
                                            <Breadcrumb />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="view-listing">
                                            <div className="infos">
                                                <div className="row">
                                                    <div className="col-12 col-lg-8">
                                                        <div className="gallery">
                                                            {adv.ads.images.length > 1 && (
                                                                <div className="counter" onClick={() => handleLightBox()}>
                                                                    <span>Voir les photos</span>
                                                                </div>
                                                            )}

                                                            <div className="slider-single animation-slide height-auto dir-nav">
                                                                {adv.ads.images.length === 0 ?
                                                                    (
                                                                        <div className="slider-item">
                                                                            <div className="image">
                                                                                <a
                                                                                    data-toggle="lightbox"
                                                                                    data-gallery="product-gallery"
                                                                                    onClick={() => handleLightBox()}
                                                                                >
                                                                                    <img
                                                                                        className="img"
                                                                                        src={placeholder}
                                                                                        alt=""
                                                                                    />
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    ) : adv.ads.images.length === 1 ?  (
                                                                        <div className="slider-item">
                                                                            <div className="image one">
                                                                                <a
                                                                                    data-toggle="lightbox"
                                                                                    data-gallery="product-gallery"
                                                                                    onClick={() => handleLightBox()}
                                                                                >
                                                                                    <img
                                                                                        className="img"
                                                                                        src={ADS_IMAGE_URL + adv.ads.images[0].name}
                                                                                        alt=""
                                                                                    />
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="slider-item">
                                                                            <div className="image">
                                                                                <a
                                                                                    data-toggle="lightbox"
                                                                                    data-gallery="product-gallery"
                                                                                    onClick={() => handleLightBox()}
                                                                                >
                                                                                    <LazyLoadImage
                                                                                        effect="blur"
                                                                                        width={335} height={325}
                                                                                        className="img"
                                                                                        src={ADS_IMAGE_URL + adv.ads.images[0].name}
                                                                                        alt=""
                                                                                    />
                                                                                </a>
                                                                            </div>
                                                                            <div className="image">
                                                                                <a
                                                                                    data-toggle="lightbox"
                                                                                    data-gallery="product-gallery"
                                                                                    onClick={() => handleLightBox()}
                                                                                >
                                                                                    <LazyLoadImage
                                                                                        effect="blur"
                                                                                        width={"100%"} height={"100%"}
                                                                                        className="img"
                                                                                        src={ADS_IMAGE_URL + adv.ads.images[1].name}
                                                                                        alt=""
                                                                                    />
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-lg-4 md-mb-5">
                                                        <div className="actions-block">
                                                            <ul className="stack">
                                                                <li>
                                                                    <Link to={`/profile/${adv.ads.user.id}`} className="user-details-wrapper">
                                                                    <span className="user-details">
                                                                      <span className="left">
                                                                        <span className="user-img">
                                                                          <span className="avatar text-center">
                                                                            <LazyLoadImage width={"100%"} height={"100%"} effect="blur" src={`${adv.ads.user.image ? ADS_IMAGE_URL + adv.ads.user.image.name : "/assets/images/svg/avatar.svg"}`} alt="" />
                                                                          </span>
                                                                        </span>
                                                                        <span className="user-name">
                                                                          <span className="name">
                                                                              {adv.ads.user.firstName}
                                                                              <div className="connect">
                                                                                   {adv.ads.user.connectionStatus === "ONLINE" ? (
                                                                                       <>
                                                                                           <span className="online"></span><span className="text">en ligne</span>
                                                                                       </>
                                                                                   ) : (
                                                                                       <>
                                                                                           <span className="offline"></span><span className="text">hors ligne</span>
                                                                                       </>
                                                                                   )}
                                                                              </div>
                                                                              <span className="verified">{adv.relatedAds.ads.length} annonces</span>
                                                                          </span>
                                                                        </span>
                                                                      </span>
                                                                      <span className="right">
                                                                        <span className="user-icon">
                                                                          <ArrowRight />
                                                                        </span>
                                                                      </span>
                                                                    </span>
                                                                    </Link>
                                                                </li>

                                                                <li className="hr" />

                                                                <li>
                                                                    {adv.ads.price_cents >= 20 && adv.ads.user.stripeUserId  && (
                                                                        <>
                                                                            {adv.ads.status !== "active" ? (
                                                                                <Link to={`/buy/${adv.ads.id}?purchaseId=${adv.ads.purchaseId}&selectedShipping=${adv.ads.shipping_cost ? adv.ads.shipping_cost.split(",").length === 2 ? adv.ads.shipping_cost.split(",")[1] : adv.ads.shipping_cost.split(",")[0] : "face-to-face"}`} className={`btn btn-primary full-width ${adv.ads.status !== "active" ? "disabled" : ""}`}>
                                                                                    En cours de vente
                                                                                </Link>
                                                                                ) : (
                                                                                <Link to={`/buy/${adv.ads.id}?purchaseId=${adv.ads.purchaseId}&selectedShipping=${adv.ads.shipping_cost ? adv.ads.shipping_cost.split(",").length === 2 ? adv.ads.shipping_cost.split(",")[1] : adv.ads.shipping_cost.split(",")[0] : "face-to-face"}`} className={`btn btn-primary full-width`}>
                                                                                    Acheter
                                                                                </Link>
                                                                                )}
                                                                        </>
                                                                    )}
                                                                    {
                                                                       (!adv.ads.user.stripeUserId || adv.ads.price_cents < 20) && ( !showNumber ? (
                                                                            <Link to="" className={`btn btn-primary  full-width ${adv.ads.status !== "active" ? "disabled" : ""}`} onClick={() => setShowNumber(true)}>
                                                                                Afficher le numéro
                                                                            </Link>
                                                                        ): (
                                                                            <Link to="" className="btn btn-primary  full-width" onClick={() => setShowNumber(false)}>
                                                                                {adv.ads.user.phone}
                                                                            </Link>
                                                                        ))
                                                                    }
                                                                    {credentials && adv.ads.user.id === credentials["userId"] ? "" : existsChat && !existsChat.exists ? (
                                                                        <Link to="#@" className={`btn btn-secondary full-width ${adv.ads.status !== "active" ? "disabled" : ""}`} onClick={(e) => handleLightBoxReply(e)}>
                                                                            Envoyer un message
                                                                        </Link>
                                                                    ): (
                                                                        <Link to={`/dashboard/mes-messages/${existsChat && existsChat.chatId}`} className={`btn btn-secondary full-width ${adv.ads.status !== "active" ? "disabled" : ""}`}>
                                                                            Envoyer un message
                                                                        </Link>
                                                                    ) }
                                                                </li>

                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-12 col-lg-12 my-auto">
                                                        <div className="title">
                                                            <h2>{adv.ads.subject}</h2>
                                                            <div className="price-shipping">
                                                                {adv.ads.price_cents > 0 && <p className="price">{adv.ads.price_cents} €</p>}
                                                                {adv.ads.shipping_cost && adv.ads.shipping_cost !== "" && (
                                                                    <span className="shipping">Livraison: à partir de 3.20€</span>
                                                                )}

                                                            </div>
                                                            <p className="date">{moment(adv.ads.createdAt).calendar()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="details">
                                                {adv.ads.criteria && (
                                                    <div className="row justify-content-center">
                                                        <div className="col-12">
                                                            <SectionTitle
                                                                titleText="Critères"
                                                                positionClass="left"
                                                                spaceClass="mb-55"
                                                            />
                                                            <div className="listing-custom labels">
                                                                {Object.keys(convertCriteria(adv.ads.criteria, getCategoryCriteria(criteriaData, adv.ads.category))).map((item, index) => {

                                                                    return (
                                                                        <div className="item labeled">
                                                                            <span>{item}</span>
                                                                            <span>{convertCriteria(adv.ads.criteria, getCategoryCriteria(criteriaData, adv.ads.category))[item]}</span>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="detail-wrapper">
                                                            <div className="detail-header text-center">
                                                                <SectionTitle
                                                                    titleText="Description"
                                                                    positionClass="left"
                                                                    spaceClass="mb-55"
                                                                />
                                                            </div>
                                                            <div className="detail-content">
                                                                <p>{adv.ads.body}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {adv.ads.shipping_cost && (
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <div className="detail-wrapper">
                                                                        <div className="detail-header text-center">
                                                                            <SectionTitle
                                                                                titleText="Livraison"
                                                                                positionClass="left"
                                                                                spaceClass="mb-55"
                                                                                subtitleText="Recevez ce bien à domicile ou à deux pas de chez vous"
                                                                            />
                                                                        </div>
                                                                        <div className="detail-content">
                                                                            {
                                                                                adv.ads.shipping_cost.split(",").length === 2 ?
                                                                                    (
                                                                                        <>
                                                                                            <Shipping
                                                                                                icon="/assets/images/svg/mondialrelay.svg"
                                                                                                price={3.49}
                                                                                                subtitle="en point Mondial Relay sous 3-5 jours"
                                                                                                title="Mondial Relay"/>

                                                                                            <Shipping
                                                                                                icon="/assets/images/svg/laposte.svg"
                                                                                                price={6.32}
                                                                                                subtitle="à votre domicile sous 2-3 jours"
                                                                                                title="Courrier suivi"/>
                                                                                        </>
                                                                                    ) : adv.ads.shipping_cost.split(",").length === 1 && adv.ads.shipping_cost.split(",")[0] === "courrier-suivi" ?
                                                                                        (
                                                                                            <Shipping
                                                                                                icon="/assets/images/svg/laposte.svg"
                                                                                                price={6.32}
                                                                                                subtitle="à votre domicile sous 2-3 jours"
                                                                                                title="Courrier suivi"/>
                                                                                        ) : (
                                                                                            <Shipping
                                                                                                icon="/assets/images/svg/mondialrelay.svg"
                                                                                                price={3.49}
                                                                                                subtitle="en point Mondial Relay sous 3-5 jours"
                                                                                                title="Mondial Relay"/>
                                                                                        )
                                                                            }

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="detail-wrapper">
                                                                    <div className="detail-header text-center">
                                                                        <SectionTitle
                                                                            titleText={`${adv.ads.address.city} (${adv.ads.address.pincode})`}
                                                                            positionClass="left"
                                                                            spaceClass="mb-55"
                                                                            icon={<Location/>}
                                                                        />
                                                                    </div>
                                                                    {adv.ads.location && (
                                                                        <div className="detail-content">

                                                                            <Mapview viewport={{
                                                                                latitude: adv.ads.location.coordinates[1],
                                                                                longitude: adv.ads.location.coordinates[0],
                                                                                zoom: 13,
                                                                            }}/>
                                                                        </div>
                                                                    )}



                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    adv.relatedAds.ads.length > 0 && (
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <section className="product-wrapper">
                                                                    <div className="row">
                                                                        <SectionTitle
                                                                            titleText={`Les annonces de ${adv.ads.user.firstName}`}
                                                                            positionClass="left"
                                                                            spaceClass="mb-55"
                                                                        />
                                                                    </div>
                                                                    <div className="row">
                                                                        {adv.relatedAds.ads.map((item: any, index: number) => (
                                                                            <ProductGlobal
                                                                                ads={item}
                                                                                display="list"
                                                                                index={index}
                                                                            />
                                                                        ))}
                                                                    </div>

                                                                </section>
                                                            </div>
                                                        </div>
                                                    )
                                                }

                                            </div>
                                        </div>
                                    </div>


                                        <LightboxReply
                                            handleLightBox={(e) => handleLightBoxReply(e)}
                                            user={adv.ads.user}
                                            value={formData ? formData.message : ""}
                                            errRegexp={formErrRegexp}
                                            errMandatory={formErrRegexp}
                                            handleChange={(e, rules) => handleChange(e, rules)}
                                            handleBlur={(e, rules) => handleBlur(e, rules)}
                                            handleSubmit={(e, rules) => handleSubmit(e, rules, adv.ads.id, adv.ads.user.id)}
                                            loading={chat_loading}
                                            success={success}
                                            errors={errors}
                                            existsChat={existsChat}
                                        />

                                    {adv.ads.images.length > 0 && <LightboxImage images={adv.ads.images} handleLightBox={handleLightBox}/>}
                                </div>
                            </div>
                        </section>
                    </>
                ) : (
                    <NoResult link="/" msg="Retour à la page d'accueil" imgClassName="img"/>
            )}

        </Fragment>

    )
};


const mapStateToProps = (state: State) => ({
    auth: state.auth,
    chat: state.chat
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    createChat: (data: { ads: string; receiver: string; sender: string; owner: string; dest: string; message: string }) => dispatch(createChat(data)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type AdvProps = ConnectedProps<typeof connector>;

export default connector(Adv);