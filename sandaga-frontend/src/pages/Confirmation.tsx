import React, {Fragment, FunctionComponent, useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import Success from "../components/Success";
import {State} from "../redux/types";
import {Dispatch} from "redux";
import {activeUser} from "../redux/actions/auth.actions";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import {GlobalsActionTypes} from "../redux/types/globals.type";
import {SEO} from "../components/seo";

const Confirmation: FunctionComponent<ConfirmationProps> = ({activeUser}) => {
    const [message, setMessage] = useState<string>("")
    const [status, setStatus] = useState<string>("loading")
    const [redirect, setRedirect] = useState<string>("")
    const [searchParams] = useSearchParams();
    const count = useRef(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = searchParams.get("code");
    const ref = searchParams.get("ref");

    useEffect(() => {

        if (count.current === 0) {
            token && getActiveUser(token)
        }
        count.current++;

        if (status === "success" && ref === "active") {
            setTimeout(() => {
                navigate(redirect, {replace: true})
            }, 5000)
        }

        if (status === "success" && ref === "reset") {
            setTimeout(() => {
                navigate(redirect, {replace: true})
            }, 1)
        }

        if (status === "error") {
            setTimeout(() => {
                navigate(redirect, {replace: true})
            }, 5000)
        }

    }, [status])

    const getActiveUser = useCallback(async (token: string) => {
       if(status === "loading") {

           const res = await activeUser(token)

           if(Object.values(res)[0] === true && ref === "active") {
               setStatus("success");
               setMessage("Félicitations, votre compte a été activé avec succès.")
               setRedirect("/login")
           } else if(Object.values(res)[0] === true && ref === "reset") {
               setStatus("success");
               setMessage("Félicitations, vous allez être redirigé vers la page de réinitialisation.")
               setRedirect("/reset-password")
               dispatch({type: GlobalsActionTypes.RESET, payload: token})
           }
           else if(Object.values(res)[0] === false) {
               setStatus("error");
               setMessage(Object.values(res)[1].message.split(".")[1])
               setRedirect("/")
           }
       }
    }, [status])

    return(
        <Fragment>
            <SEO title="Status - Sandaga" description="Status d'authenfication" />
            <section className="bkg-light medium">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="boxed-container auth">
                                <Success status={status} message1={message} redirect={redirect}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
};

const mapStateToProps = (state: State) => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    activeUser: (token: string) => dispatch(activeUser(token))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConfirmationProps = ConnectedProps<typeof connector>;

export default connector(Confirmation)