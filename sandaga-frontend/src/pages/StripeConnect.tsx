import React, {Fragment, FunctionComponent, useEffect, useState} from 'react';
import queryString from 'query-string'
import {useLocation} from "react-router-dom";
import {stripeUpdate} from "../components/api/api-user";
import {State} from "../redux/types";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import {Alert} from "reactstrap";
import {SEO} from "../components/seo";
import Success from "../components/Success";
import {AuthActionTypes} from "../redux/types/auth.type";
const StripeConnect: FunctionComponent<StripeConnectProps> = ({auth: { credentials }}) => {
    const [error, setError] = useState<boolean>(false);
    const [connecting, setConnecting] = useState<boolean>(false);
    const [connected, setConnected] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [redirect, setRedirect] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const parsed = queryString.parse(location.search);
        if(parsed.error){
            setError(true);
            setMessage("Impossible de connecter votre compte Stripe. Réessayez plus tard.")
        }

        if(parsed.code){
            setConnecting(true);
            setError(false);
            setMessage("Connecter votre compte Stripe...");

            //post call to stripe, get credentials and update user data
            stripeUpdate(parsed.code).then((data) => {
                if (data.error) {
                    setError(true);
                    setConnected(false);
                    setConnecting(false);
                    setMessage("Impossible de connecter votre compte Stripe. Réessayez plus tard.")
                } else {
                    setError(false);
                    setConnected(true);
                    setConnecting(false);
                    setMessage("Votre compte Stripe connecté avec succès !")

                    dispatch({
                        type: AuthActionTypes.ADD_STRIPE_USER_ID,
                        payload: data.stripeUserId
                    })
                }
                setRedirect("/dashboard")
            })
        }

    }, []);

    return (
        <Fragment>
            <SEO title="Status - Sandaga" description="Status d'authenfication" />
            <section className="bkg-light medium">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="boxed-container auth">
                                <Success status={error ? "error": connected ? "success": "loading"} message1={message} redirect={redirect}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

const mapStateToProps = (state: State) => ({
    auth: state.auth,
});

const connector = connect(mapStateToProps, null);

type StripeConnectProps = ConnectedProps<typeof connector>;

export default connector(StripeConnect);