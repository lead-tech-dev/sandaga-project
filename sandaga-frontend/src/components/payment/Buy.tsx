import React, {Fragment, FunctionComponent, useEffect, useRef, useState} from 'react';
import SectionTitle from "../section-title/section-title";
import "./buy.style.scss"

import {
    headersWithAuthorization,
    PAYMENT_URL,
} from "../../hooks/useConfig";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import NoResult from "../no-result/no-result";
import {getUrls} from "../../helpers/Poster";
import PaymentRight from "./payment-right";
import PaymentLeft from "./payment-left";
import {State} from "../../redux/types";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import {PaymentActionTypes} from "../../redux/types/payment.type";
import {SEO} from "../seo";
import Success from "../Success";

const Buy: FunctionComponent<BuyProps> = ({ payment: {success}}) => {
   const [paymentInfoData, setPaymentInfoData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true)
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const purchaseId = searchParams.get("purchaseId")
    const selectedShipping = searchParams.get("selectedShipping")
    const [message, setMessage] = useState<string>("Félicitation votre commande à été déposée!");
    const [redirect, setRedirect] = useState<string>("/dashboard/mes-paiements");
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                dispatch({
                    type: PaymentActionTypes.PAYMENT_ERROR
                })
                navigate(redirect, {replace: true});
            }, 5000)
        }
    }, [success]);

    useEffect(() => {
        if (purchaseId) {
            ApiPaymentInfoInitCall(parseInt(purchaseId));
        }

    }, [purchaseId])


    const ApiPaymentInfoInitCall = (purchaseId: number) => {
        setLoading(true);
        fetch(PAYMENT_URL + "/purchases/" + purchaseId,{
            method: "GET",
            mode: "cors",
            headers: {
                ...headersWithAuthorization(),
            }
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {

                if (response.ok){
                    if (selectedShipping) {
                        let payment = {...json,  delivery_modes: {
                                ...json.delivery_modes,
                                display: {
                                    ...json.delivery_modes.display,
                                    selected: selectedShipping
                                }
                            }}
                        setPaymentInfoData(payment)
                    }else {
                        setPaymentInfoData(json)
                    }
                    setLoading(false)
                }else {
                    setPaymentInfoData(null)
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err);
            });

    }


    const handleRadioChange = (e: any) => {
        setPaymentInfoData((prevState: any) => {
            return {
            ...prevState,  delivery_modes: {
            ...prevState.delivery_modes,
                    display: {
                ...prevState.delivery_modes.display,
                        selected: e.target.value
                }
            }
            }
        })
        const query = new URLSearchParams(location.search);
        let urls = getUrls(query);
        setSearchParams({purchaseId: urls["purchaseId"], selectedShipping: e.target.value})
    }

    //console.log(paymentInfoData)

    return (
        <>
            {success ? (
                    <Fragment>
                        <SEO title="Status - Sandaga" description="Status d'authenfication" />
                        <section className="bkg-light medium">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="boxed-container auth">
                                            <Success status={"success"} message1={message} redirect={redirect}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </Fragment>

            ): (
                    <section className="buy-wrapper">
                        <div className="container">
                            <div className="row">
                                <SectionTitle
                                    titleText="Paiment"
                                    positionClass="left"
                                    spaceClass=" mb-55"
                                />
                            </div>
                            {loading ? "" : paymentInfoData ? (
                                <form autoComplete="off">
                                    <div className="row">
                                        <div className="col-12 col-md-8">
                                            {paymentInfoData.delivery_modes.display.ordering.includes(paymentInfoData.delivery_modes.display.selected) && (
                                                <PaymentLeft data={paymentInfoData} selected={paymentInfoData.delivery_modes.display.selected}/>
                                            )}
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <PaymentRight data={paymentInfoData} handleRadioChange={handleRadioChange}/>
                                        </div>
                                    </div>

                                </form>
                            ): <NoResult link="/recherche" msg="Reformuler la recherche"/>}
                        </div>
                    </section>
                )}
        </>

    )
};

const mapStateToProps = (state: State) => ({
    payment: state.payment
});

const connector = connect(mapStateToProps, null);

type BuyProps = ConnectedProps<typeof connector>;

export default connector(Buy);