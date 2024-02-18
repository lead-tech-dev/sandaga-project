import React, {FunctionComponent, useEffect} from "react";
import IconSuccess from "../assets/icons/IconSuccess";
import Button from "./Button";
import {useLocation, useNavigate} from "react-router-dom";
import {SuccessInterface} from "../interfaces/form.interface";
import IconError from "../assets/icons/IconError";
import ArrowRight from "../assets/icons/ArrowRight";
import {useDispatch} from "react-redux";
import {GlobalsActionTypes} from "../redux/types/globals.type";

const Success: FunctionComponent<SuccessInterface> = ({status,  message1, message2 ,email, redirect}) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div id='card' className="animated fadeIn">
                                <div className={`upper-side ${status}`}>

                                   { status === "loading" && (
                                       <div className="spinner-border text-secondary mb-3" role="status">
                                           <span className="sr-only">Chargement...</span>
                                       </div>
                                   )}
                                    { status === "success" && (
                                        <IconSuccess/>
                                    )}
                                    { status === "error" && (
                                        <IconError/>
                                    )}
                                    <h3 id='status'>
                                        {status && status}
                                    </h3>
                                </div>
                                {status === "success" && (message1 !== "" || message2 !== "") && (
                                    <div id='lower-side'>
                                        {message1 && (
                                            <p id='message'>
                                                {message1}
                                            </p>
                                        )}
                                        {email && message2 && (
                                            <p id='message'>
                                                {message2} : <span>{email}</span>
                                            </p>
                                        )}
                                        <Button type="link" className="btn btn-primary" link={redirect} onClick={() => redirect && navigate(redirect, {replace: true}) } label="Continuer" iconRight={<ArrowRight/>}/>
                                    </div>
                                )}

                                {status === "error" && message1  && (
                                    <div id='lower-side'>
                                        {message1 && (
                                            <p id='message'>
                                                {message1}
                                            </p>
                                        )}

                                        <Button type="link" className={`btn btn-secondary`} link={redirect} onClick={() => {
                                            dispatch({
                                                type: GlobalsActionTypes.CLEAR_ERRORS
                                            })
                                            redirect && navigate(redirect, {replace: true})
                                        } }  label="Continuer" iconRight={<ArrowRight/>}/>
                                    </div>
                                )}
                            </div>
    )
}
export default  Success;