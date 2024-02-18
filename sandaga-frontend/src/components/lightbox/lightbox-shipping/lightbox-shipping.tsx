import React, {FunctionComponent, useEffect, useState} from 'react';
import Close from "../../../assets/icons/Close";
import "./lightbox-shipping.style.scss";
import SelectShipping, {SelectOption} from "../../selects/select-shipping/select-shipping";
import {PaymentType} from "../../product/product-payment/product-payment";
import {Link, useNavigate} from "react-router-dom";
import Textarea from "../../criteria/Textarea";
import {
    processCancel,
    processCharge,
    processPaid,
    processReceive, processRefund,
    processSend,
    processSuspend, processTracking
} from "../../api/api-order";
import {isDisabledSelect, isDisabledTimeline, isExpired} from "../../../helpers/Buy";
import Button from "../../Button";
import {useSelector} from "react-redux";

interface LightboxShippingProps {
    handleLightBox: (e: any, payment?: PaymentType) => void;
    paymentProps: PaymentType | null
}
const LightboxShipping: FunctionComponent<LightboxShippingProps> = ({ handleLightBox, paymentProps}) => {
    const [problem, setProblem] = useState<boolean>(false)
    const [relayLoading, setRelayLoading] = useState<boolean>(false)
    const [payment, setPayment] = useState<PaymentType | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number | null>(null);
    const [paymentType, setPaymentTYpe] = useState<string | null>(null);
    const { credentials } = useSelector((state: any) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(payment && payment.buyer.id === credentials["userId"])
        if (payment && payment.buyer.id === credentials["userId"]) {
            setPaymentTYpe("Achat")
        }else {
            setPaymentTYpe("Vente")
        }
    }, [payment]);

    useEffect(() => {
        setPayment(paymentProps);
    }, [paymentProps]);

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(null);
            }, 5000)
        }
    }, [error]);
    const handleAvailable = (option: SelectOption) => {
        setLoading(true)
        setCurrentStep(1);
        if (option.value === "oui") {
            processCharge({paymentId: payment?.id, buyerId: payment?.buyer.id, selected: option.label})
                .then((res: any) => {
                    if (res.success) {
                        setPayment(res.data);
                        setLoading(false)
                    }else {
                        setError(res.error);
                        setLoading(false)
                    }
                    console.log(res)
                })
                .catch((error) => {
                    setLoading(false)
                    setError(error);
                })
        }else {
            if (window.confirm(`voulez-vous vraiment continuer ? l'annonce sera supprimée.`)) {
                processCancel({paymentId: payment?.id})
                    .then((res: any) => {
                        if (res.success) {
                           // navigate("/dashboard/mes-paiments", {replace: true})
                            setPayment(res.data);
                            setLoading(false)
                        }else {
                            setError(res.error);
                            setLoading(false)
                        }
                    })
                    .catch((error) => {
                        setError(error);
                        setLoading(false)
                    })
            }

        }
    }
    const handleSend = (option: SelectOption) => {
        if (option.value === "oui") {
            setLoading(true)
            setCurrentStep(2);
            processSend({paymentId: payment?.id, buyerId: payment?.buyer.id, selected: option.label})
                .then((res: any) => {
                    console.log(res)
                    if (res.success) {
                        setPayment(res.data);
                        setLoading(false)
                    }else {
                        setError(res.error);
                        setLoading(false)
                    }
                })
                .catch((error) => {
                    setError(error);
                    setLoading(false)
                })
        }else {
            processCancel({paymentId: payment?.id})
                .then((data: any) => {
                    setPayment((prevState) => prevState && ({...prevState, shippingStatus: data.shippingStatus}))
                })
                .catch((error) => {
                    setError(error);
                })
        }
    }
    const handleReceive = (option: SelectOption) => {
        setLoading(true)
        setCurrentStep(3);
        if (option.value === "oui") {
            processReceive({paymentId: payment?.id, buyerId: payment?.buyer.id, selected: option.label})
                .then((res: any) => {
                    if (res.success) {
                        setPayment(res.data);
                        setLoading(false)
                    }else {
                        setError(res.error);
                        setLoading(false)
                    }
                })
                .catch((error) => {
                    setError(error);
                })
        }else {
            processSuspend({paymentId: payment?.id, buyerId: payment?.buyer.id, selected: option.label, step: "3"})
                .then((res: any) => {
                    if (res.success) {
                        setPayment(res.data);
                        setLoading(false)
                    }else {
                        setError(res.error);
                        setLoading(false)
                    } })
                .catch((error) => {
                    setError(error);
                    setLoading(false)
                    setCurrentStep(null);
                })
        }
    }
    const handlePaid = (option: SelectOption) => {
        setLoading(true)
        setCurrentStep(4);
        if (option.value === "oui") {
            processPaid({paymentId: payment?.id, buyerId: payment?.buyer.id, selected: option.label})
                .then((res: any) => {
                    if (res.success === true) {
                        setPayment(res.data);
                        setLoading(false)
                        setCurrentStep(null);
                    }else {
                        setError(res.error);
                        setLoading(false)
                    }
                })
                .catch((error) => {
                    setError(error);
                    setLoading(false)
                    setCurrentStep(null);
                })
        }else {
            processSuspend({paymentId: payment?.id, buyerId: payment?.buyer.id, selected: option.label, step: "4"})
                .then((res: any) => {
                    if (res.success) {
                        setPayment(res.data);
                        setLoading(false)
                    }else {
                        setError(res.error);
                        setLoading(false)
                    } })
                .catch((error) => {
                    setError(error);
                    setLoading(false)
                    setCurrentStep(null);
                })
        }
    }
    const handleRefund = (option: SelectOption) => {
        if (window.confirm(`voulez-vous vraiment continuer ? la transaction sera supprimé.`)) {
            setLoading(true)
            setCurrentStep(5);
            if (option.value === "oui") {
                processRefund({paymentId: payment?.id, buyerId: payment?.buyer.id, selected: option.label})
                    .then((res: any) => {
                        if (res.success === true) {
                            navigate("/dashboard/mes-paiements", {replace: true});

                            //setPayment(res.data);
                            // setLoading(false)
                            // setCurrentStep(null);
                        }else {
                            setError(res.error);
                            setLoading(false)
                        }
                    })
                    .catch((error) => {
                        setError(error);
                        setLoading(false)
                        setCurrentStep(null);
                    })
            }
        }

    }
    const handleTrackingColis = (expNumber: string) => {
        setRelayLoading(true);
        setCurrentStep(3)
        processTracking({enseigne: "BDTEST13", expeditions: expNumber, langue: "FR"})
            .then((res: any) => {
                if (res.success) {
                    alert(JSON.stringify(res.data));
                    setRelayLoading(false)
                }else {
                    setError(res.error);
                    setRelayLoading(false)
                } })
            .catch((error) => {
                setError(error);
                setLoading(false)
                setCurrentStep(null);
            })
    }

    console.log(payment)

    return (
        <div className="col-12">
            <div className={`lightbox-shipping ${paymentType === "Vente" ? "custom" : ""}`}>
                <div className="lightbox-content">
                    <div
                        className="lightbox-content__close"
                        onClick={(e) => handleLightBox(e)}
                    >
                        <Close onClick={(e) => console.log(e)} />
                    </div>
                    <div className="shipping-wrapper">
                        <div className="shipping-wrapper__left">
                            <div className="header">
                                <div className="item">
                                    <h3>Adresse de livraison: <span>{payment?.shippingAddress.street}, {payment?.shippingAddress.pincode} {payment?.shippingAddress.city}</span></h3>
                                </div>
                                <div className="item">
                                    <h3>Mode de livraison: <span>{payment && payment.delivery_mode.split("-").join(" ")}</span></h3>
                                </div>
                                <div className="item">
                                    <h3>Status: <span>{payment?.status === "cancel" ? "Annulé": payment?.status === "suspend" ? "Suspendue": payment?.status === "pay" ? "Payer": "Encours"}</span></h3>
                                </div>

                            </div>
                            <div className="shipping-step">
                                <div className="timeline">
                                    {paymentType === "Vente" && (
                                        <>
                                            <div className={`timeline-item ${payment && isDisabledTimeline(payment, 1) ? "disabled"  : ""}`}>
                                                <span className="question">Votre bien est-il toujours disponible ?</span>
                                                <div className="select-wrapper">
                                                   <div className="select-content">
                                                       <SelectShipping
                                                           options={[
                                                               {label: "Oui, le bien est disponible", value: "oui"},
                                                               {label: "Non, le bien n'est plus disponible", value: "non"}
                                                           ]}
                                                           disabled={!!(payment && isDisabledSelect(payment, 1)) || loading}
                                                           onOptionSelected={(e, option) => handleAvailable(option)}
                                                           customStyle={payment && isDisabledSelect(payment, 1)  ? "disabled" : ""}
                                                           data={ payment && payment.shippingStep.length > 0 &&  payment.shippingStep[0].selected !== null ?
                                                               payment.shippingStep[0].selected : null }
                                                           loading={currentStep === 1 ? loading : null}
                                                       />
                                                       {currentStep === 1 && error && <p className="step-error">Une erreur s'est produite. Veuillez réessayer plus tard!</p>}

                                                       {payment && payment.delivery_mode === "mondial-relay" && payment.shippingStep.length > 0 &&  payment.shippingStep[0].status === "available" && (
                                                           <div className="download-link">
                                                               <Link to={payment.labelUrl} target="_blank">Télécharger <span>le bon d'envoie </span>maintenant</Link>
                                                               <i className="fa fa-question-circle">
                                                                <span className="download-info">
                                                                    Il est temps de préparer l'envoie de votre colis.
                                                                    Téléchargez le bon d'envoie ci-contre, l'imprimer, le coller
                                                                    ensuite sur le colis et enfin vous rendre dans le point relay
                                                                    le plus proche de chez vous le deposer.
                                                                </span>
                                                               </i>

                                                           </div>
                                                       )}

                                                   </div>

                                                    <div className="info">
                                                        <p>Vous disposez de 2 jours pour confirmer
                                                            la disponibilité de votre bien, au dela du quel
                                                            la transaction sera annulée
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`timeline-item ${payment && isDisabledTimeline(payment, 2) ? "disabled"  : ""}`}>
                                                <span className="question">{`Votre bien a t-il été ${payment?.delivery_mode === "face-to-face" ? "remis en main propre" : "envoyé"} ?`}</span>
                                                <div className="select-wrapper">
                                                    <div className="select-content">
                                                        <SelectShipping
                                                            options={[
                                                                {label: `Oui, le bien a été ${payment?.delivery_mode === "face-to-face" ? "remis en main propre" : "envoyé"}`, value: "oui"},
                                                                {label: `Non, le bien n'a pas été ${payment?.delivery_mode === "face-to-face" ? "remis en main propre" : "envoyé"}`, value: "non", display: isExpired(payment, 2)}
                                                            ]}
                                                            disabled={!!(payment && isDisabledSelect(payment, 2)) || loading}
                                                            onOptionSelected={(e, option) => handleSend(option)}
                                                            customStyle={payment && isDisabledSelect(payment, 2)  ? "disabled" : ""}
                                                            data={ payment && payment.shippingStep.length > 1  ?
                                                                payment.shippingStep[1].selected : null }
                                                            loading={currentStep === 2 ? loading : null}
                                                            error={currentStep === 1 && error}
                                                        />
                                                    </div>
                                                    {currentStep === 2 && error && <p className="step-error">Une erreur s'est produite. Veuillez réessayer plus tard!</p>}

                                                    <div className="info">
                                                        <p>Vous disposez de 3 jours à compter de la confirmation
                                                            de la disponibilté pour {payment?.delivery_mode === "face-to-face" ? "remettre en main propre " : "envoyé "}
                                                            votre bien, au dela du quel
                                                            la transaction sera annulée
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {payment && payment.shippingStep.length === 5 && (payment.status === "suspend" || payment?.shippingStep[4].status === "refund") && (
                                                <div className={`timeline-item ${payment && isDisabledTimeline(payment, 4) ? "disabled"  : ""}`}>
                                                    <span className="question">Un problème a été déclaré par l'acheteur</span>
                                                    <div className="select-wrapper">
                                                        <div className="select-content">
                                                            <SelectShipping
                                                                options={[
                                                                    {label: "Oui, Déclencher le remboursement", value: "oui"},
                                                                ]}
                                                                disabled={!!(payment && isDisabledSelect(payment, 4)) || loading}
                                                                onOptionSelected={(e, option) => handleRefund(option)}
                                                                customStyle={payment && isDisabledSelect(payment, 4) ? "disabled" : ""}
                                                                data={payment && payment.shippingStep.length > 4  ?
                                                                    payment.shippingStep[4].selected : null}
                                                                loading={currentStep === 5 ? loading : null}
                                                                error={currentStep === 5 && error}

                                                            />
                                                            {currentStep === 5 && error && <p className="step-error mt-4">Une erreur s'est produite. Veuillez réessayer plus tard!</p>}
                                                        </div>

                                                        <div className="info">
                                                            <p>Un problème a été déclaré par l'acheteur et le
                                                                paiement a été suspendu.
                                                                Vous pouvez a tout moment annuler la trasaction en déclenchant son
                                                                remboursement.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {paymentType === "Achat" && (
                                        <>
                                            <div className={`timeline-item ${payment && isDisabledTimeline(payment, 3) ? "disabled"  : ""}`}>
                                                <span className="question">Avez-vous reçu l'article ?
                                                    {payment?.delivery_mode === "mondial-relay" && (
                                                        <Button
                                                            type="button"
                                                            className={""}
                                                            onClick={() => payment && handleTrackingColis(payment.expNumber)}
                                                            label="Suivre le colis"
                                                            iconLeft={<i className="fa fa-truck"/>}
                                                        />
                                                    )}
                                                </span>
                                                <div className="select-wrapper">
                                                    <div className="select-content">
                                                        <SelectShipping
                                                            options={[
                                                                {label: "Oui, j'ai reçu le colis", value: "oui"},
                                                                {label: "Non, je n'ai pas reçu le colis", value: "non", display: isExpired(payment, 3, 4)}
                                                            ]}
                                                            disabled={!!(payment && isDisabledSelect(payment, 3)) || loading}
                                                            onOptionSelected={(e, option) => handleReceive(option)}
                                                            customStyle={payment && isDisabledSelect(payment, 3) ? "disabled" : ""}
                                                            data={ payment && payment.shippingStep.length > 2  ?
                                                                payment.shippingStep[2].selected : null }
                                                            loading={currentStep === 3 ? loading : null}
                                                            error={currentStep === 3 && error}
                                                        />
                                                        {currentStep === 3 && error && <p className="step-error">Une erreur s'est produite. Veuillez réessayer plus tard!</p>}

                                                        {payment?.shippingStep.length === 3 && payment.delivery_mode !== "face-to-face" && payment?.status === "suspend" && (
                                                            <div className="download-link">
                                                                <span>Vous n'avez pas reçcu le colis ? </span>
                                                                <i className="fa fa-question-circle">
                                                                <span className="no-receive">
                                                                    Vous dévez contacter directement le transporteur
                                                                    et vous s'enquerir de la situation.
                                                                </span>
                                                                </i>

                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="info">
                                                        <p>{payment?.delivery_mode === "face-to-face" ?
                                                            "Confirmer la reception en main propre de l'article et déclencher le paiment ou pas à l'étape suivante." :
                                                            "Vous disposez de 10 jours à compter de l'envoie du colis pour confirmer la reception, au dela du quel la transaction sera automatiquement suspendue. pourrez déclencher la suspension de la transaction qu'à partir du 6ème jour."
                                                        }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`timeline-item ${payment && isDisabledTimeline(payment, 4) ? "disabled"  : ""}`}>
                                                <span className="question">Tout est ok ?</span>
                                                <div className="select-wrapper">
                                                    <div className="select-content">
                                                        <SelectShipping
                                                            options={[
                                                                {label: "Oui, tout va bien", value: "oui"},
                                                                {label: "Non, j'ai un problème", value: "non"}
                                                            ]}
                                                            disabled={!!(payment && isDisabledSelect(payment, 4)) || loading}
                                                            onOptionSelected={(e, option) => handlePaid(option)}
                                                            customStyle={payment && isDisabledSelect(payment, 4) ? "disabled" : ""}
                                                            data={ payment && payment.shippingStep.length > 3  ?
                                                                payment.shippingStep[3].selected :  null }
                                                            loading={currentStep === 4 ? loading : null}
                                                            error={currentStep === 4 && error}
                                                        />
                                                        {currentStep === 4 && error && <p className="step-error">Une erreur s'est produite. Veuillez réessayer plus tard!</p>}

                                                        {payment?.shippingStep.length === 4 || payment?.shippingStep.length === 5 && payment.status === "suspend" && (
                                                            <div className="download-link">
                                                                <span>Vous avez un problème avec le colis ? </span>
                                                                <i className="fa fa-question-circle">
                                                                <span className="problem">
                                                                    Nous vous conseillons dans un prémier temps de
                                                                    contactez le vendeur pour un arrangement à l'amiable. Après
                                                                    7 jours, si le problème n'est pas résolu, nos équipes seront
                                                                    automatiquement saisies. Dès la résolution du problème, vous pourrez déclencher
                                                                    le paiment en cliquant sur "Oui, tout est ok"
                                                                </span>
                                                                </i>
                                                               {/* <div className="form-wrapper">
                                                                    <form>
                                                                        <Textarea
                                                                            field={{name: "", label: ""}}
                                                                            errRegexp={""}
                                                                            errMandatory={""}
                                                                            handleChange={(e) => console.log(e)}
                                                                            onBlur={(e) => console.log(e) }
                                                                            value={""}
                                                                            className="custom"
                                                                        />

                                                                        <button
                                                                            type="submit"
                                                                            className="btn btn-primary full-width"
                                                                            disabled={true}
                                                                        >
                                                                            Envoyer
                                                                        </button>
                                                                        <span className="indication">
                                                                            Nous vous conseillons dans un prémier temps de
                                                                        contactez le vendeur pour un arrangement à l'amibe. Après
                                                                        7 jours, si le problème n'est pas résolu, nos équipes seront
                                                                        automatiquement saisies.
                                                                    </span>

                                                                    </form>
                                                                </div>*/}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="info">
                                                        <p>
                                                            {payment?.delivery_mode !== "face-to-face" ?
                                                                "Vous disposez de 3 jours à compter de la reception du colis pour confirmer la conformité, au dela du quel le paiement sera automatiquement déclenché." :
                                                                "Confirmez la conformité de l'article et déclenchez le paiment"
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="footer">
                                <span>NB:</span>
                                <span>
                                    Le déclachement du paiement ne sera possible que lorsque l'acheteur aura reçu et
                                    confirmé la conformité de l'article
                                </span>
                            </div>
                       </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LightboxShipping;