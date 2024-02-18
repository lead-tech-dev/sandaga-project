import React, {FunctionComponent, useEffect} from 'react';
import "./lightbox-reply.style.scss";
import Textarea from "../../criteria/Textarea";
import Close from "../../../assets/icons/Close";
import {FormDataInterface, RulesInterface} from "../../../interfaces/form.interface";
import {useDispatch} from "react-redux";
import {GlobalsActionTypes} from "../../../redux/types/globals.type";
interface ReplyProps {
    handleLightBox: (e: any) => void;
    handleChange: (e: any, rules: RulesInterface) => void;
    handleBlur: (e: any, rules: RulesInterface) => void;
    handleSubmit: (e: any, rules: RulesInterface) => void
    errRegexp: any;
    errMandatory: any;
    value: string
    user: any;
    loading: boolean;
    success: boolean;
    errors: any;
    existsChat: {exists: boolean; chatId: string} | null;
}

const field = {
    name: "message",
    label: "Votre message",
    rules: {
        err_mandatory: "Veuillez rédiger un message",
        err_regexp:
            "Le message est top court, veuillez saisir au moins 3 caractères",
        mandatory: true,
        max_length: 4000,
        regexp: "[^\\s](.|\\n){1,}[^\\s]",
    },
}
const LightboxReply: FunctionComponent<ReplyProps> = ({existsChat, success, loading, errors, errMandatory, errRegexp, handleSubmit, handleLightBox, user, handleChange, handleBlur, value}) => {
    const dispatch = useDispatch();

    console.log(existsChat)
    useEffect(() => {
        if (success) {
            setTimeout(() => {
                dispatch({
                    type: GlobalsActionTypes.CLEAR_ERRORS
                })
            }, 5000)
        }

        if (errors) {
            setTimeout(() => {
                dispatch({
                    type: GlobalsActionTypes.CLEAR_ERRORS
                })
            }, 5000)
        }
    }, [success, errors]);
    return(
        <div className="col-12">
            <div className="lightbox-reply">
                <div className="lightbox-content">
                    <div
                        className="lightbox-content__close"
                        onClick={(e) => handleLightBox(e)}
                    >
                        <Close onClick={(e) => console.log(e)} />
                    </div>
                    <div className="reply-wrapper">
                        <div className="reply-wrapper__left">
                            <div className="info-inner">
                                <h3>Envoyer un message à {user.firstName}</h3>
                                <p><i className="fa fa-bell-slash"/> Refuse toute démarche commercials</p>

                                <div className="message">
                                    {success || existsChat?.exists && <span className="success">Votre message a été transmis avec success!</span>}
                                    {errors && <span className="error">Une erreur s'est produite!</span>}
                                </div>


                            </div>
                            <form className="form-wrapper" noValidate onSubmit={(e) => handleSubmit(e, field.rules)}>
                                <div className="textarea-inner">
                                    <Textarea
                                        field={{name: field.name, label: field.label}}
                                        errRegexp={errRegexp ? errRegexp["message" as keyof FormDataInterface] : ""}
                                        errMandatory={errMandatory ? errMandatory["message" as keyof FormDataInterface] : ""}
                                        handleChange={(e) => handleChange(e, field.rules)}
                                        onBlur={(e) => handleBlur(e, field.rules) }
                                        value={value}
                                    />
                                </div>
                                <div className="btn-inner">
                                    <button
                                        type="submit"
                                        className="btn btn-primary full-width"
                                        disabled={existsChat?.exists || errRegexp && errRegexp["message"] || loading || value === ""}
                                    >
                                        Envoyer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LightboxReply;