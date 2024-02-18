import React, {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
  ReactNode,
  createRef,
  LegacyRef,
  Fragment,
  ChangeEvent,
} from "react";
import {
  AdTypeInterface,
  CategoryInterface,
  ContentInterface,
  CriteriaInterface,
  SubCategoryInterface,
  FieldRefInterface,
} from "../interfaces/ads.interface";
import { categoriesData, criteriaData } from "../data/data";
import { State } from "../redux/types";
import { useDispatch } from "react-redux";
import { connect, ConnectedProps } from "react-redux";
import { getCategoriesDataByAccountType } from "../helpers/Poster";
import Radio from "../components/Radio";
import Button from "../components/Button";
import Light from "../assets/icons/Light";
import CriteriaFilter from "../components/criteria/CriteriaFilter";
import Location from "../components/criteria/Location";
import { GlobalsActionTypes } from "../redux/types/globals.type";
import { AdsActionTypes } from "../redux/types/ads.type";
import { Dispatch } from "redux";
import { refreshExpiredToken } from "../redux/actions/auth.actions";
import { addAds } from "../redux/actions/ads.actions";
import Success from "../components/Success";
import { useNavigate } from "react-router-dom";
import { tokenExpired } from "../hooks/useConfig";
import SelectCategories from "../components/selects/select-category/select-categories";
import Uploader from "../components/upload/upload";
import {SEO} from "../components/seo";

const Poster: FunctionComponent<PosterProps> = ({
  auth: { credentials },
  adsData: { ads, success, loading, errors },
  addAds,
  refreshExpiredToken,
}) => {
  //const accountType: number = credentials["accountType"]
  const accountType: number = 0;
  const [categories, setCategories] = useState<CategoryInterface[] | null>(
    null,
  );
  const [criteria, setCriteria] = useState<CriteriaInterface>(criteriaData);
  const [subCategory, setSubCategory] = useState<SubCategoryInterface | null>(
    null,
  );
  const [category, setCategory] = useState<CategoryInterface | null>(null);
  const [adTypes, setAdTypes] = useState<AdTypeInterface | null>(null);
  const [selectedAdType, setSelectedAdType] = useState<{
    label: string;
    selected: string;
  } | null>(null);
  const [categoryCriteria, setCategoryCriteria] = useState<
    ContentInterface[] | []
  >([]);

  const [fieldRef, setFieldRef] = useState<FieldRefInterface | null>(null);
  const count = useRef(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    if (count.current === 0) {
      const categories = getCategoriesDataByAccountType(
        categoriesData,
        accountType,
      );
      setCategories(categories);

      const data = Object.values(ads)[0].data;

      if (Object.keys(data).length > 0) {
        let categoryId = data.subCategoryId;
        let adType = data.adType;
        let subCat;

        setCategoryCriteria(
          Object.values(criteria)[accountType][categoryId][adType],
        );

        setSelectedAdType({ label: adType, selected: adType });

        categories?.forEach((category) => {
          category.subcategories.forEach((item) => {
            if (item.id === categoryId) {
              subCat = item;
            }
          });
        });

        subCat && setSubCategory(subCat);

        subCat && handleAdTypeSelected(subCat, accountType, adType);
      }

      if (success) {
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
          dispatch({ type: GlobalsActionTypes.CLEAR_ERRORS });
        }, 5000);
      }
    }
    count.current++;

    return () => {
      //clear();
    };
  }, [success]);

  const handleAdTypeSelected = (
    subCategory: SubCategoryInterface,
    accountType: number,
    adType: string,
  ) => {
    let adTypes = {} as AdTypeInterface;
    let defaultAdType: AdTypeInterface = subCategory?.ad_types;
    let rights = subCategory && Object.values(subCategory.rights)[accountType];
    Object.keys(rights)
      .reverse()
      .forEach((right) => {
        if (Object.keys(defaultAdType).includes(right)) {
          adTypes[right] = defaultAdType[right];
        }
      });
    setAdTypes(adTypes);
    setSelectedAdType({
      label: adType,
      selected: adType,
    });
  };

  const handleSubCategorySelected = (
    category: CategoryInterface,
    subCategory: SubCategoryInterface,
    accountType: number,
  ) => {
    dispatch({
      type: AdsActionTypes.INIT_ADS_DATA,
    });
    setSubCategory(subCategory);
    setCategory(category);
    let rights = Object.values(subCategory.rights)[accountType];
    let defaultAdType: AdTypeInterface = subCategory.ad_types;
    let adTypes = {} as AdTypeInterface;

    Object.keys(rights)
      .reverse()
      .forEach((right) => {
        if (Object.keys(defaultAdType).includes(right)) {
          adTypes[right] = defaultAdType[right];
        }
      });
    setAdTypes(adTypes);
    setSelectedAdType({
      label: Object.keys(adTypes)[0],
      selected: Object.keys(adTypes)[0],
    });

    handleStepAddData({ label: "categoryId", value: category.id }, 0);
    handleStepAddData({ label: "subCategoryId", value: subCategory.id }, 0);
    handleStepAddData(
      { label: "categoryLabel", value: category.label.toLowerCase() },
      0,
    );
    handleStepAddData(
      { label: "subCategoryLabel", value: subCategory.label.toLowerCase() },
      0,
    );
    handleStepAddData({ label: "adType", value: Object.keys(adTypes)[0] }, 0);

    handleStepError("categoryLabel", false, 0);


  };

  const handleSelectRadio = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedAdType({
      label: e.currentTarget.value,
      selected: e.currentTarget.value,
    });
    handleStepAddData({ label: "adType", value: e.currentTarget.value }, 0);
  };

  const handleResetAdType = () => {
    setSelectedAdType(null);
  };

  const handleCategoryCriteria = (
    accountType: number,
    categoryId: string,
    right: string,
    currentStep: number,
    nextStep: boolean,
  ) => {
    if (Object.keys(ads).length === 1) {
      const categoryCriteria: ContentInterface[] =
        Object.values(criteria)[accountType][categoryId][right];
      setCategoryCriteria(categoryCriteria);

      categoryCriteria.forEach((criteria, index) => {
        let key = `step_${index + 1}`;
        let data = {} as { [key: string]: string; value: string };
        let ref = {} as { [key: string]: LegacyRef<HTMLInputElement> };
        let errors = [] as string[];
        let indexShippingCost: number = 0;
        let indexInfo: number = 0;

        criteria.fields?.forEach((field) => {
          ref[field.label] = createRef();
          errors = [...errors, field.label];

          if (field.label === "Moyen de livraison") {
            indexShippingCost = index + 1;
          }

          if (field.label === "Email") {
            indexInfo = index + 1;
          }
        });


        if (!criteria.fields) {
          errors = [...errors, "location"];
        }

        setFieldRef(ref);

        dispatch({
          type: AdsActionTypes.GLOBAL_STEP,
          key: key,
          data: data,
          active: false,
          errors: errors,
        });

        handleStepAddData(
          {
            label: "shipping_cost",
            value: "courrier-suivi,mondial-relay",
          },
          indexShippingCost,
        );

        credentials && handleStepAddData(
            {
              label: "phone",
              value: credentials["phone"],
            },
            indexInfo,
        );
        credentials && handleStepAddData(
            {
              label: "email",
              value: credentials["email"],
            },
            indexInfo,
        );
      });

      let data = {} as { [key: string]: string };
      let errors = [] as string[];

      dispatch({
        type: AdsActionTypes.GLOBAL_STEP,
        key: `step_${categoryCriteria.length + 1}`,
        data: data,
        active: false,
        errors: errors,
      });
    }
    nextStep && handleNextStep(currentStep);
  };

  const handlePreviousStep = (currentStep: number) => {
    dispatch({
      type: AdsActionTypes.PREVIOUS_STEP,
      currentStep: currentStep,
    });
  };

  const handleNextStep = (currentStep: number) => {
    dispatch({
      type: AdsActionTypes.NEXT_STEP,
      currentStep: currentStep,
    });
  };

  const handleStepAddData = (
    option: { label: string; value: any },
    currentStep: number,
  ) => {
    dispatch({
      type: AdsActionTypes.ADD_DATA_STEP,
      option: option,
      currentStep: currentStep,
    });
  };

  const handleStepRemoveData = (label: string, currentStep: number) => {
    dispatch({
      type: AdsActionTypes.REMOVE_DATA_STEP,
      label: label,
      currentStep: currentStep,
    });
  };

  const handleStepError = (
    label: string,
    isError: boolean,
    currentStep: number,
  ) => {
    dispatch({
      type: AdsActionTypes.ERRORS_STEP,
      label: label,
      isError: isError,
      currentStep: currentStep,
    });
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

    if (Object.keys(criteria).length > 0) {
      formData.criteria = criteria;
    }

    formData.userId = credentials && credentials["userId"];
    let res = null as any;

    if (tokenExpired()) {
      res = await refreshExpiredToken();

      if (res && res.success) {
        addAds(formData, images);
      }
    } else {
      addAds(formData, images);
    }
  };

  const step = Object.values(ads);

  return (
    <Fragment>
      {success && (
          <>
            <SEO title="Status - Sandaga" description="Status de l'ajout d'une annonce" />
            <section className="bkg-light medium">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="boxed-container auth">
                      <Success
                          status="success"
                          message1="Félicitations, votre annonce a été postée."
                          redirect="/dashboard"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section></>
      )}

      {!success && (
        <>
          <SEO title="Poster - Sandaga" description="Poster une annonce" />
          <section className="bkg-light medium">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="boxed-container post">
                    <div className="post-listing">
                      <form onSubmit={handleSubmit}>
                        {/* Etape 1: Récupération du titre  */}

                        {/* Etape 2: Récupération de la catégorie */}
                        {step[0].active && (
                            <div
                                className={`block  ${step[0].active && "active"}`}
                                key={0}
                            >
                              <div className="row">
                                <div className="col-12 col-lg-8">
                                  <div className="section-content">
                                    <div className="section-header">
                                      <span>Commençons par l'essentiel !</span>
                                    </div>
                                    <div className="section-body">
                                      <div className="section-body-inner">
                                        <div className="col-12 mb-3">
                                          <div className="form-group ">
                                            {categories && (
                                                <SelectCategories
                                                    options={categories}
                                                    onOptionSelected={(
                                                        category,
                                                        subCategory,
                                                    ) =>
                                                        handleSubCategorySelected(
                                                            category,
                                                            subCategory,
                                                            accountType,
                                                        )
                                                    }
                                                    subCategory={subCategory}
                                                    category={category}
                                                    onHandleAdType={() =>
                                                        handleResetAdType()
                                                    }
                                                    annonceData={step[0].data}
                                                />
                                            )}
                                          </div>
                                        </div>

                                        {subCategory && selectedAdType && (
                                            <div className="col-12 mt-5">
                                              <div className="form-group">
                                                <label>Type d'annonce</label>
                                                <div
                                                    className="row"
                                                    style={{ marginLeft: "-12px" }}
                                                >
                                                  {subCategory &&
                                                      adTypes &&
                                                      Object.keys(adTypes).map(
                                                          (item, index): ReactNode => {
                                                            return (
                                                                <div
                                                                    className="col-12 col-md-5"
                                                                    key={index}
                                                                >
                                                                  <div className="form-group ">
                                                                    <Radio
                                                                        name="type_annonce"
                                                                        label={
                                                                          adTypes[item].label
                                                                        }
                                                                        value={item}
                                                                        selected={
                                                                          selectedAdType.selected
                                                                        }
                                                                        headLabel="Type d'annonce"
                                                                        description={
                                                                          adTypes[item]
                                                                              .description
                                                                        }
                                                                        handleRadioClick={(
                                                                            e,
                                                                        ) =>
                                                                            handleSelectRadio(e)
                                                                        }
                                                                    />
                                                                  </div>
                                                                </div>
                                                            );
                                                          },
                                                      )}
                                                </div>
                                              </div>
                                            </div>
                                        )}
                                      </div>
                                    </div>
                                    {subCategory && selectedAdType && (
                                        <div className="section-footer">
                                          <div className="row">
                                            <div className="col-6">
                                              <Button
                                                  label="Retour"
                                                  className="btn-canceled right full-height disabled"
                                                  type="button"
                                                  onClick={() => console.log("")}
                                              />
                                            </div>
                                            <div className="col-6 text-right">
                                              <Button
                                                  label="Suivant"
                                                  className="btn-primary full-height"
                                                  type="button"
                                                  onClick={() =>
                                                      handleCategoryCriteria(
                                                          accountType,
                                                          subCategory.id,
                                                          selectedAdType.selected,
                                                          0,
                                                          true,
                                                      )
                                                  }
                                              />
                                            </div>
                                          </div>
                                        </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-12 col-lg-4 mt-5">
                                  <div className="section-header">
                                    <div className="inner">
                                      <div className="img">
                                        <Light />
                                      </div>
                                      <div className="text">
                                        <p>
                                          Votre annonce sera trouvée plus facilement
                                          !
                                        </p>
                                        <p>
                                          Vous aurez 50% de chances en plus d’être
                                          contacté si votre annonce est dans la
                                          bonne catégorie.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                        )}

                        {/* Etape 3 à n: Gestion de l'ensemble des critères */}
                        {step.length > 1 &&
                            categoryCriteria?.map((criteria, index) => {
                              return (
                                  <>
                                    {step[index + 1].active && (
                                        <div
                                            className={`block ${
                                                step[index + 1] &&
                                                step[index + 1].active &&
                                                "active"
                                            }`}
                                            key={index}
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
                                                                        key={i}
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
                                                                        adsState={
                                                                          step[index + 1].data
                                                                        }
                                                                        handleRemoveData={(
                                                                            label,
                                                                        ) =>
                                                                            handleStepRemoveData(
                                                                                label,
                                                                                index + 1,
                                                                            )
                                                                        }
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

                                                <div className="section-footer">
                                                  <div className="row">
                                                    <div className="col-6">
                                                      <Button
                                                          label="Retour"
                                                          className="btn-canceled right full-height"
                                                          type="button"
                                                          onClick={() =>
                                                              handlePreviousStep(index + 1)
                                                          }
                                                      />
                                                    </div>
                                                    <div className="col-6 text-right">
                                                      <Button
                                                          label="Suivant"
                                                          className={`btn-primary full-height ${
                                                              step[index + 1].errors
                                                                  .length > 0 && "disabled"
                                                          }`}
                                                          type="submit"
                                                          onClick={() =>
                                                              handleNextStep(index + 1)
                                                          }
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
                                    )}
                                  </>
                              );
                            })}
                        {/* Etape 3 à n + 1: Gestion des images */}
                        {step.length > 1 && step[step.length - 1].active && (
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
                                                            handleRemoveData={(label) =>
                                                                handleStepRemoveData(
                                                                    label,
                                                                    step.length - 1,
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

                                          {/* <div className="col-12 col-md-4">
                                  <File fileNumber="Photo 2" />
                                </div>

                                <div className="col-12 col-md-4">
                                  <File fileNumber="Photo 3" />
                                </div>

                                <div className="col-12 col-md-4">
                                  <File fileNumber="Photo 4" />
                                </div>

                                <div className="col-12 col-md-4">
                                  <File fileNumber="Photo 5" />
                                </div>

                                <div className="col-12 col-md-4">
                                  <File fileNumber="Photo 6" />
                                </div> */}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="section-footer">
                                      <div className="row">
                                        <div className="col-6">
                                          <Button
                                              label="Retour"
                                              className="btn-canceled right full-height"
                                              type="button"
                                              onClick={() =>
                                                  handlePreviousStep(step.length - 1)
                                              }
                                          />
                                        </div>
                                        <div className="col-6 text-right">
                                          <Button
                                              label="Poster l'annonce"
                                              className={`btn-primary full-height`}
                                              type="submit"
                                              onClick={(e) => handleSubmit(e)}
                                              disabled={loading}
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
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state: State) => ({
  auth: state.auth,
  adsData: state.adsData,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  addAds: (formData: any, images: { [key: string]: File }) =>
    dispatch(addAds(formData, images)),
  refreshExpiredToken: () => dispatch(refreshExpiredToken()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PosterProps = ConnectedProps<typeof connector>;

export default connector(Poster);
