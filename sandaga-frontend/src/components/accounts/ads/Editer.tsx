import React, {createRef, FunctionComponent, LegacyRef, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Light from "../../../assets/icons/Light";
import {
    ContentInterface,
    CriteriaInterface,
    FieldRefInterface
} from "../../../interfaces/ads.interface";
import {criteriaData} from "../../../data/data";
import {GlobalsActionTypes} from "../../../redux/types/globals.type";
import {ADS_URL, headersWithAuthorization} from "../../../hooks/useConfig";
import CriteriaFilter from "../../criteria/CriteriaFilter";
import Location from "../../criteria/Location";
import Button from "../../Button";
import {AdsActionTypes} from "../../../redux/types/ads.type";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import {State} from "../../../redux/types";
import {Dispatch} from "redux";
import {updateAds} from "../../../redux/actions/ads.actions";
import ProductGlobal from "../../product/product-global/product-global";
import SectionTitle from "../../section-title/section-title";
import Uploader from "../../upload/upload";
import {deleteImage} from "../../../redux/actions/image.actions";


const Editer: FunctionComponent<EditerProps> = ({adsData: {ads, success, loading: loadingUpdate,}, auth: {credentials}, updateAds, deleteImage}) => {
    const [fieldRef, setFieldRef] = useState<FieldRefInterface | null>(null);
    const [criteria, setCriteria] = useState<CriteriaInterface>(criteriaData);
    const [categoryCriteria, setCategoryCriteria] = useState<
        ContentInterface[] | []
    >([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [files, setFiles] = useState<{[key: string]: any}>({});
    const [ad, setAd] = useState<any>(null);
    const count = useRef(0);
    const param = useParams();
    const accountType: number = 0;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {

        if (count.current === 0 && param) {
            userAdApiCall(String(param.adsId));

        }
        count.current++

        if (success) {
            setTimeout(() => {
                navigate(`/dashboard`, { replace: true });
                dispatch({ type: GlobalsActionTypes.CLEAR_ERRORS });
            }, 500);
        }

        return () => {
            dispatch({ type: GlobalsActionTypes.CLEAR_ERRORS });
        }
    }, [param, success])

    useEffect(() => {
        if (ad && ad.id) {
           // setCategoryCriteria(Object.values(criteria)[accountType][ad.category.id][ad.ad_type]);
            handleSubCategorySelected(ad.category.id, ad.ad_type);

        }
    }, [ad])

    const userAdApiCall = (adId: string) => {
        setLoading(true);

        fetch(ADS_URL + "/" + adId , {
            method: "GET",
            mode: "cors",
            headers: {
                ...headersWithAuthorization(),
            }
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {

                if (response.ok){
                    setAd(json)
                    setLoading(false)
                }else {
                    setAd(null)
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err);
            });

    }
    const handleSubCategorySelected = (category: string, adType: string,) => {
        dispatch({
            type: AdsActionTypes.INIT_ADS_DATA,
        });

        handleStepAddData({ label: "subCategoryId", value: category}, 0);

        handleStepAddData({ label: "adType", value:  adType}, 0);

        if (categoryCriteria) {
            setCategoryCriteria([]);
        }

        handleCategoryCriteria(ad, accountType, ad.category.id, ad.ad_type, 0, true)
    }

    const handleCategoryCriteria = (ad: any, accountType: number, categoryId: string, right: string, currentStep: number, nextStep: boolean,) => {

        if (Object.keys(ads).length > 0) {
            const categoryCriteria: ContentInterface[] =
                Object.values(criteria)[accountType][categoryId][right];
            setCategoryCriteria(categoryCriteria);

            categoryCriteria.forEach((criteria, index) => {
                let key = `step_${index + 1}`;
                let data = {} as { [key: string]: string; value: string };
                let ref = {} as { [key: string]: LegacyRef<HTMLInputElement> };
                let errors = [] as string[];

                setFieldRef(ref);

                dispatch({
                    type: AdsActionTypes.GLOBAL_STEP,
                    key: key,
                    data: data,
                    active: false,
                    errors: errors,
                });

                criteria.fields?.forEach((field) => {
                    ref[field.label] = createRef();
                    errors = [...errors, field.label];

                    ad.criteria && Object.keys(ad.criteria).forEach(item => {
                        if (item === field.name) {
                            handleStepAddData(
                                {
                                    label: item,
                                    value: ad.criteria[item],
                                },
                                index + 1,
                            );
                        }
                    })

                    Object.keys(ad).forEach(item => {

                        if (item === field.name) {

                            handleStepAddData(
                                {
                                    label: item,
                                    value: ad[item],
                                },
                                index + 1,
                            );
                        }
                    })

                });
                if (criteria.name === "coordinates") {
                    if (ad.address) {
                        handleStepAddData(
                            {
                                label: "address",
                                value: { number: ad.address.number, street: ad.address.street, pincode: ad.address.pincode, city: ad.address.city, state: ad.address.state, country: ad.address.country}
                            },
                            index + 1,
                        );

                        handleStepAddData(
                            {
                                label: "point",
                                value: {longitude: ad.point.longitude, latitude: ad.point.latitude},
                            },
                            index + 1,
                        );
                    }

                    errors = [...errors, "location"];
                }

            });

            let data = {"Photo 1": ""} as { [key: string]: string }
            let errors = [] as string[];

            dispatch({
                type: AdsActionTypes.GLOBAL_STEP,
                key: `step_${categoryCriteria.length + 1}`,
                data: data,
                active: false,
                errors: errors,
            });


           ad.images && ad.images.forEach((item: any, fileIndex: number) => {
                setFiles((files) => ({...files, [`Photo ${fileIndex + 1}`]: {file: item["name"], id: item["id"], status: "no-action"}}));

                handleStepAddData(
                    {
                        label: `Photo ${fileIndex + 1}`,
                        value: {name: item["name"], id: item["id"]},
                    },
                    categoryCriteria.length + 1
                );
            })
        }
        //nextStep && handleNextStep(currentStep);
    };

    const handleStepAddData = (option: { label: string; value: any }, currentStep: number) => {
        dispatch({
            type: AdsActionTypes.ADD_DATA_STEP,
            option: option,
            currentStep: currentStep,
        });
    };
    const handleStepRemoveData = (label: string, currentStep: number, id?: string) => {
        if (label.startsWith("Photo") && files[label]?.file) {
            setFiles((files) => ({...files, [label]: {file: files[label].file, id: id, status: "delete"}}));
        }

        dispatch({
            type: AdsActionTypes.REMOVE_DATA_STEP,
            label: label,
            currentStep: currentStep,
        });
    };

    const handleStepError = (label: string, isError: boolean, currentStep: number,) => {
        dispatch({
            type: AdsActionTypes.ERRORS_STEP,
            label: label,
            isError: isError,
            currentStep: currentStep,
        });
    };
    const handleCancel = () => {
        navigate("/", { replace: true });
        dispatch({ type: GlobalsActionTypes.CLEAR_ERRORS });
    };


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let formData = {} as { [key: string]: any };
        let criteria = {} as { [key: string]: any };
        let images = { ...ads[`step_${Object.values(ads).length - 1}`].data } as {
            [key: string]: any;
        };

        if (Object.keys(ads).length === 8) {
            criteria = { ...ads[`step_${1}`].data } as { [key: string]: any };

            for (let i = 2; i < Object.keys(ads).length - 1; i++) {
                formData = { ...formData, ...ads[`step_${i}`].data };
            }
        }else {
            for (let i = 1; i < Object.keys(ads).length - 1; i++) {
                formData = { ...formData, ...ads[`step_${i}`].data };
            }
        }

        formData.categoryId = ads[`step_${0}`].data.subCategoryId;
        formData.ad_type = ads[`step_${0}`].data.adType;

        if (Object.keys(ad).includes("criteria")){
            formData.criteria = criteria;
        }

        Object.entries(files).forEach(item => {
            if (item[1].status === "no-action") {
                delete images[item[0]]
            }
        })

        updateAds(ad.id, formData, images, files);

    };

    const step = Object.values(ads);

    return(
        <div className="boxed-container post">
            <div className="post-listing">
                <div className="row">
                    <SectionTitle
                        titleText="Modifier votre annonce"
                        positionClass="left"
                        spaceClass="mb-55 ml-20"
                    />
                </div>
                {ad && (
                   <div className="row">
                       <div className="col-12 col-md-8">
                           <div className="product-wrapper margin-inline">
                               <ProductGlobal
                                   ads={{
                                       "imageCount": ad.images.length,
                                       "id": ad.id,
                                       "imageName": ad.images.length > 0 ? ad.images[0].name: "",
                                       "subject": ad.subject,
                                       "price_cents": ad.price_cents,
                                       "category": ad.category.label,
                                       "pincode": ad.address.pincode,
                                       "city": ad.address.city,
                                       "createdAt": ad.createdAt
                                   }}
                                   index={1}
                                   display="row"
                               />
                           </div>
                       </div>
                   </div>
                )}
                <form onSubmit={handleSubmit}>
                    {step.length > 1 &&
                        categoryCriteria?.map((criteria, index) => {
                            return (
                                <div
                                    className="block"
                                >
                                    <div className="row">
                                        <div className="col-12 col-md-8">
                                            <div className="section-content">
                                                <div className="section-header">
                                                    <span>{criteria.label}</span>
                                                </div>
                                                <div className="section-body">
                                                    <div className="section-body-inner">
                                                        <div className="row">
                                                            {criteria.fields &&
                                                                criteria.fields.map(
                                                                    (field, i) => {
                                                                        return (
                                                                            <CriteriaFilter
                                                                                name={criteria.label}
                                                                                field={field}
                                                                                ref={fieldRef}
                                                                                handleResult={(
                                                                                    option,
                                                                                ) =>
                                                                                    handleStepAddData(
                                                                                        {
                                                                                            label:
                                                                                            option.name,
                                                                                            value:
                                                                                            option.value,
                                                                                        },
                                                                                        index + 1,
                                                                                    )
                                                                                }
                                                                                handleError={(
                                                                                    errMsg,
                                                                                    isError,
                                                                                ) =>
                                                                                    handleStepError(
                                                                                        errMsg,
                                                                                        isError,
                                                                                        index + 1,
                                                                                    )
                                                                                }
                                                                                adsState={step[index + 1].data}
                                                                                handleRemoveData={(
                                                                                    label,
                                                                                ) =>
                                                                                    handleStepRemoveData(
                                                                                        label,
                                                                                        index + 1,
                                                                                    )
                                                                                }
                                                                                key={i}
                                                                            />
                                                                        );
                                                                    },
                                                                )}

                                                            {!criteria.fields && (
                                                                <Location
                                                                    handleResult={(option) =>
                                                                        handleStepAddData(
                                                                            option,
                                                                            index + 1,
                                                                        )
                                                                    }
                                                                    adsData={step[index + 1].data}
                                                                    handleError={(label) =>
                                                                        handleStepError(
                                                                            label,
                                                                            false,
                                                                            index + 1,
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 mt-5">
                                            <div className="section-header">
                                                <div className="inner">
                                                    <div className="img">
                                                        <Light />
                                                    </div>
                                                    {criteria.label === "Dites-nous en plus" && (
                                                        <div className="text">
                                                            <p>
                                                                Mettez en valeur votre annonce !
                                                            </p>
                                                            <p>
                                                                Plus il y a de détails, plus vos futurs contacts
                                                                vous trouveront rapidement.
                                                            </p>
                                                        </div>
                                                    )}

                                                    {criteria.label === "Décrivez votre bien !" && (
                                                        <div className="text">
                                                            <p>
                                                                Mettez en valeur votre bien ! Plus il y a de détails,
                                                                plus votre annonce sera de qualité.
                                                            </p>
                                                            <p>
                                                                Détaillez ici ce qui a de l'importance et ajoutera de la valeur.
                                                            </p>
                                                        </div>
                                                    )}

                                                    {criteria.label === "Quel est votre prix ?" && (
                                                        <div className="text">
                                                            <p>
                                                                Vous le savez, le prix est important. Soyez juste,
                                                                mais ayez en tête une marge de négociation si besoin.
                                                            </p>
                                                        </div>
                                                    )}

                                                    {criteria.label === "Remise du bien" && (
                                                        <div className="text">
                                                            <p>
                                                                Vous le savez, le prix est important, autant pour vous que pour l’acheteur.
                                                            </p>

                                                            <p>En activant la livraison, profitez du paiement en ligne sécurisé.</p>
                                                        </div>
                                                    )}

                                                    {criteria.label === "Où se situe votre bien ?" && (
                                                        <div className="text">
                                                            <p>
                                                                Pour des raisons de confidentialité, si vous renseignez votre adresse exacte,
                                                                celle-ci n’apparaîtra jamais sur votre annonce.
                                                            </p>
                                                        </div>
                                                    )}

                                                    {criteria.label === "Vos coordonnées" && (
                                                        <div className="text">
                                                            <p>
                                                                Afin de mieux personnaliser votre annonce.
                                                            </p>

                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                    {step.length > 1 && (
                        <div
                            className={`block ${
                                categoryCriteria &&
                                categoryCriteria.length > 0 &&
                                step[step.length - 1].active &&
                                "active"
                            }`}
                            key={step.length - 1}
                        >
                            <div className="row">
                                <div className="col-12 col-md-8">
                                    <div className="section-content">
                                        <div className="section-header">
                                  <span>
                                    Ajoutez jusqu'à 6 photos gratuitement!
                                  </span>
                                        </div>
                                        <div className="section-body">
                                            <div className="section-body-inner">
                                                <div className="row">
                                                    {categoryCriteria.length > 0 &&
                                                        Array(6)
                                                            .fill(6)
                                                            .map((item, index) => (
                                                                <div className="col-12 col-md-4 mb-5">
                                                                    {/*<File
                                                                        fileNumber={`Photo ${
                                                                            index + 1
                                                                        }`}
                                                                        handleAddFile={(option) =>
                                                                            handleStepAddData(
                                                                                option,
                                                                                step.length - 1,
                                                                            )
                                                                        }
                                                                        handleRemoveData={(label) =>
                                                                            handleStepRemoveData(
                                                                                label,
                                                                                step.length - 1,
                                                                            )
                                                                        }
                                                                        annonceFiles={
                                                                            ads[
                                                                                `step_${step.length - 1}`
                                                                                ] &&
                                                                            ads[`step_${step.length - 1}`]
                                                                                .data[`Photo ${index + 1}`]
                                                                        }
                                                                    />*/}
                                                                    <Uploader
                                                                        fileNumber={`Photo ${
                                                                            index + 1
                                                                        }`}
                                                                        handleAddFile={(option) =>
                                                                            handleStepAddData(
                                                                                option,
                                                                                step.length - 1,
                                                                            )
                                                                        }
                                                                        handleRemoveData={(label, id) =>
                                                                            handleStepRemoveData(
                                                                                label,
                                                                                step.length - 1,
                                                                                id
                                                                            )
                                                                        }
                                                                        adFiles={
                                                                            ads[
                                                                                `step_${step.length - 1}`
                                                                                ] &&
                                                                            ads[`step_${step.length - 1}`]
                                                                                .data[`Photo ${index + 1}`]
                                                                        }
                                                                        fileData={
                                                                            ads[
                                                                                `step_${step.length - 1}`
                                                                                ] &&
                                                                            ads[`step_${step.length - 1}`]
                                                                                .data
                                                                        }
                                                                    />
                                                                </div>
                                                            ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="section-footer">
                                            <div className="row">
                                                <div className="col-6">
                                                    <Button
                                                        label="Annuler"
                                                        className="btn-canceled right full-height"
                                                        type="button"
                                                        onClick={() =>
                                                            handleCancel()
                                                        }
                                                    />
                                                </div>
                                                <div className="col-6 text-right">
                                                    <Button
                                                        label="Modifier l'annonce"
                                                        className={`btn-primary full-height`}
                                                        type="submit"
                                                        onClick={(e) => handleSubmit(e)}
                                                        disabled={loadingUpdate}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 mt-5">
                                    <div className="section-header">
                                        <div className="inner">
                                            <div className="img">
                                                <Light />
                                            </div>
                                            <div className="text">
                                                <p>
                                                    6 photos dans une annonce augmentent de 30% le nombre de contacts !
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </form>

            </div>
        </div>
    )
};

const mapStateToProps = (state: State) => ({
    auth: state.auth,
    adsData: state.adsData,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    updateAds: (id: string, formData: any, images: { [key: string]: File }, files: {[key: string]: any}) =>
        dispatch(updateAds(id, formData, images, files)),
    deleteImage: (id: string, type: string) => dispatch(deleteImage(id, type))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type EditerProps = ConnectedProps<typeof connector>;

export default connector(Editer);
