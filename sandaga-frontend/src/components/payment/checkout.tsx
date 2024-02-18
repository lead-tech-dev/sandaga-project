import React, {Component, Fragment, FunctionComponent, useEffect, useState} from 'react';
import {CardElement, injectStripe, Elements} from "react-stripe-elements";
import {withStyles} from "material-ui/styles";
import {loadStripe} from "@stripe/stripe-js";
import CreditCard from "./CreditCard";
import PayButton from "./pay-button";
import {create} from "../api/api-order";
import {toPaymentReq} from "../../helpers/Buy";
import Success from "../Success";
import {SEO} from "../seo";
import {useNavigate} from "react-router-dom";
import {State} from "../../redux/types";
import {Dispatch} from "redux";
import {addAds} from "../../redux/actions/ads.actions";
import {refreshExpiredToken} from "../../redux/actions/auth.actions";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import {PaymentActionTypes} from "../../redux/types/payment.type";


const stripePromise = loadStripe('pk_test_oKhSR5nslBRnBZpjO6KuzZeX');

interface CheckoutProps {
    data: {[key: string]: string} | null;
    delivery_mode: string;
    formError: any;
    selectedRelay: boolean;
    handleFormErrRegexp: (errors: {[key: string]: string}) => void
}
const Checkout: FunctionComponent<CheckoutProps> = ({handleFormErrRegexp, data, delivery_mode, formError, selectedRelay}) => {
    const [creditCardData, setCreditCardData] = useState<any>(null);
    const [stripe, setStripe] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const options = {
        // passing the client secret obtained from the server
        clientSecret: '{{CLIENT_SECRET}}'
    };



    const handleSubmit = (e: any) => {
        e.preventDefault();

        let isEmptyFields = false as  boolean

        let currentData = {} as {[key: string]: string};

        data && Object.keys(data).length > 0 && Object.keys(data).forEach((item, index) => {
            if(data[item] === "" && delivery_mode === "courrier-suivi") {
               currentData = {...currentData, [item]: `Veuillez insérer une ${item}`}
                isEmptyFields = true;
            }
        })

        Object.keys(currentData).length > 0 && handleFormErrRegexp(currentData);
        //data && console.log(toPaymentReq(data))

      if(!isEmptyFields && data) {
          setLoading(true)
          stripe.createToken().then((payload: any) => {
              if(payload.error){
                  setError(payload.error.message)
              }else{
                  let dataReq = toPaymentReq(data);
                  dataReq.token = payload.token.id;
                  create(dataReq).then((data) => {
                      console.log(data)
                      if (data.error) {
                          setError(data.error)
                          setLoading(false);
                      } else {
                          setLoading(false);
                          dispatch({
                              type: PaymentActionTypes.PAYMENT_SUCCESS
                          });
                      }
                  })
              }
          })
      }
    }

    return (
        <Fragment>
            <div className="card-wrapper">
                <p>{delivery_mode === "mondial-relay" ? "3": "2"}. Détails de la carte</p>
                <div className="row mb-5 mt-5">
                    <div className="col-12">
                        <Elements >
                            <CreditCard handleCreditCardError={(error: any) => setCreditCardData(error)} handleStripe={(stripe: any) => setStripe(stripe)}/>
                        </Elements>
                    </div>
                </div>
            </div>

            <div className="row">
                <PayButton
                    errors={formError}
                    selectedRelay={selectedRelay}
                    delivery_mode={delivery_mode}
                    creditCardData={creditCardData}
                    handleSubmit={(e: any) => handleSubmit(e)}
                    loading={loading}
                    resError={error}
                />
            </div>
        </Fragment>
    );
}


export default Checkout;