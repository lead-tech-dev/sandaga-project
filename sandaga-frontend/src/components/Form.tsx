import React, {createRef, Fragment, FunctionComponent, RefObject, useEffect, useState} from "react";
import {FormDataInterface, FormInterface, RulesInterface} from "../interfaces/form.interface";
import SectionTitle from "./section-title/section-title";
import Input from "./Input";
import Check from "../assets/icons/Check";
import {GlobalsActionTypes} from "../redux/types/globals.type";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import Success from "./Success";
import Textarea from "./criteria/Textarea";
import {SEO} from "./seo";

const Form: FunctionComponent<FormInterface> = ({fields, loading, errors, success, handleSubmitData})  => {
    const [inputRef, setInputRef] = useState<RefObject<HTMLInputElement>[]>([]);
    const [formErrRegexp, setFormErrRegexp] = useState<FormDataInterface | null>(null);
    const [formData, setFormData] = useState<FormDataInterface | null>(null);
    const [successEmail, setSuccessEmail] = useState<string>("");
    const [condition, setCondition] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fieldsLength = fields.fields.length;

       !formData && ( fields.fields.forEach(item => {
           setFormData((prevState) => ({...prevState, [item.name]: ""}))
       }))

        setInputRef((inputRef) =>
            Array(fieldsLength)
                .fill(fieldsLength)
                .map((_, i) => inputRef[i] || createRef()))

        if(fields.name === "Signin" && errors && Object.keys(errors).length > 0 ){
            setTimeout(() => {
                dispatch({type: GlobalsActionTypes.CLEAR_ERRORS})
            }, 5000)
        }

        if(fields.name === "Signup" || fields.name === "Forgot-password" && errors && errors.errorCode === 'SANDAGA-0010' ){
            if(fields.name === "Forgot-password") {
                setFormErrRegexp((prevState) =>
                    ({...prevState, email:  errors.message.split(".")[1]}))
            }else {
                setFormErrRegexp((prevState) =>
                    ({...prevState, email:  errors.message}))
            }

        }

        if(success) {
            setTimeout(() => {
                navigate("/", {replace: true})
                dispatch({
                    type: GlobalsActionTypes.CLEAR_ERRORS
                })
            }, 5000)
        }

        return () => {
            setFormErrRegexp(null)
            if(errors && Object.keys(errors).length > 0 ){
                setTimeout(() => {
                    dispatch({type: GlobalsActionTypes.CLEAR_ERRORS})
                }, 1)
            }
        }
    }, [errors, success])

    const handleInputChange = (e: any, rules: RulesInterface) => {
        const {name, value} = e.currentTarget;
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
        const {name, value} = e.currentTarget;

        if (formData  && formData[name as keyof  FormDataInterface]  === "") {
            setFormErrRegexp((prevState) => ({...prevState, [name]: rules.err_mandatory}));
            setFormData((prevState) => ({...prevState, [name]: value}))
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        let isEmptyFields = false as  boolean

        formData && Object.keys(formData).length > 0 && Object.keys(formData).forEach((item, index) => {
            if(formData[item] === "") {
                const currentRules = fields.fields.find(rule => rule.name === item)?.rules
                currentRules && setFormErrRegexp((prevState) => ({...prevState, item: currentRules.err_mandatory}));

                inputRef[index].current?.focus()
                inputRef[index].current?.blur();
                isEmptyFields = true;
            }
        })

        formData && setSuccessEmail(formData["email"])

        !isEmptyFields && handleSubmitData(formData);
    };



return(
   <Fragment>
       <SEO title={`${fields.name} - Sandaga`} description="Authentification" />
       <section className="bkg-light medium" >
           <div className="container">
               <div className="row">
                   <div className="col-12">
                       <div className="boxed-container auth">
                           <div className="authentication">
                               {success && fields.name === "Signup" && (<Success
                                   status="success"
                                   message1="Félicitations, votre compte a été créé avec succès."
                                   message2=" Un mail de confirmation a été envoyé à"
                                   email={successEmail} redirect="/"/>)
                               }

                               {success && fields.name === "Forgot-password" && (<Success
                                   status="success"
                                   message2="Félicitations, un mail de réinitialisation a été envoyé à"
                                   email={successEmail} redirect="/"/>)}

                               {success && fields.name === "Reset-password" && (<Success
                                   status="success"
                                   message1="Félicitations, votre mot de passe a été réinitialisé avec succès."
                                   redirect="/login"/>)
                               }

                               {success && fields.name === "Contact" && (<Success
                                   status="success"
                                   message1="Félicitations, votre message a été envoyé" redirect="/"/>)}

                               {!success && (
                                   <form id="login-page-form" noValidate  onSubmit={handleSubmit}>
                                       <div className="block">
                                           <div className="row">
                                               <div className="col-12">
                                                   <div className="section-header text-center">
                                                       <SectionTitle
                                                           titleText={fields.title}
                                                           positionClass="justify-content-center"
                                                           spaceClass="mb-55"
                                                       />
                                                   </div>
                                               </div>
                                           </div>

                                           {errors && Object.keys(errors).length > 0 && errors.errorCode === 'SANDAGA-0015'&& (
                                               <div className="global-error">
                                                   <span>Invalid Username/Password</span>
                                               </div>
                                           )}
                                           {errors && errors.errorCode === "SANDAGA-0001" && (
                                               <div className="global-error">
                                                   <span>Erreur, reéssayez plus tard!</span>
                                               </div>
                                           )}

                                           {fields.fields.filter(item => item.name !== "message").map((field, index) => (
                                               <div className="row justify-content-center" key={index}>
                                                   <div className="col-12 col-md-6">
                                                       <div className="form-group" >
                                                           <Input
                                                               data={{
                                                                   type: field.type,
                                                                   name: field.name,
                                                                   id: field.id,
                                                                   placeholder: field.placeholder,
                                                                   value: formData ? formData[field.name as keyof FormDataInterface] : "",
                                                                   ref: inputRef[index],
                                                                   required: field.rules.mandatory,
                                                                   errRegexp: formErrRegexp && formErrRegexp[field.name as keyof FormDataInterface],
                                                                   maxLength: field.rules.max_length
                                                               }}
                                                               handleChange={(e) => handleInputChange(e, field.rules)}
                                                               onBlur={(e) => handleBlur(e, field.rules)}
                                                           />
                                                       </div>
                                                   </div>
                                               </div>
                                           ))}

                                           {fields.fields.filter(item => item.name === "message").map((field, index) => (
                                               <div className="row justify-content-center" key={index}>
                                                   <div className="col-12 col-md-6">
                                                       <div className="form-group" >

                                                           <Textarea
                                                               field={field}
                                                               errRegexp={formErrRegexp ? formErrRegexp["message" as keyof FormDataInterface] : ""}
                                                               errMandatory={formErrRegexp ? formErrRegexp["message" as keyof FormDataInterface] : ""}
                                                               handleChange={(e) => handleInputChange(e, field.rules)}
                                                               onBlur={(e) => handleBlur(e, field.rules) }
                                                               value={formData ? formData[field.name as keyof FormDataInterface] : ""}
                                                               placeholder="Message"

                                                           />
                                                       </div>
                                                   </div>
                                               </div>
                                           ))}

                                           {fields.name === "Signin" && (
                                               <div className="row justify-content-center">
                                                   <div className="col-12 col-md-6">
                                                       <div className="form-group">
                                                           <div className="text-right">
                                                               <a href="/forgot-password" className="forgot">
                                                                   Mot de passe oublié?
                                                               </a>
                                                           </div>
                                                       </div>
                                                   </div>
                                               </div>
                                           )}

                                           {fields.name === "Signup" && (
                                               <div className="row justify-content-center">
                                                   <div className="col-12 col-md-6">
                                                       <div className="form-group">
                                                           <div className="checkbox">
                                                               <input
                                                                   type="checkbox"
                                                                   id="customer-termsandconditions"
                                                                   value="1"
                                                                   onChange={() => setCondition(!condition)}
                                                               />
                                                               <Check />
                                                           </div>
                                                           <label
                                                               htmlFor="customer-termsandconditions"
                                                               data-original-title=""
                                                               title=""
                                                           >
                                                               J'accepte{" "}
                                                               <Link  to="/conditions-generales-d-utilisation">
                                                                   les termes et conditions
                                                               </Link>
                                                           </label>
                                                       </div>
                                                   </div>
                                               </div>
                                           )}

                                           <div className="row justify-content-center">
                                               <div className="col-12 col-md-6">
                                                   <div className="text-center">
                                                       <button
                                                           type="submit"
                                                           className="btn btn-primary full-width"
                                                           disabled={(
                                                               formErrRegexp &&( formErrRegexp["firstName"] ||
                                                                   formErrRegexp["lastName"] ||
                                                                   formErrRegexp["email"] ||
                                                                   formErrRegexp["phone"] ||
                                                                   formErrRegexp["message"] ||
                                                                   formErrRegexp["password"])) ? true  : loading ? true : fields.name === "Signup" && !condition }
                                                       >
                                                           {fields.btn}
                                                       </button>
                                                       <p>
                                                           {fields.link.question}
                                                           <a href={`${fields.link.href}`}>{fields.link.icon && fields.link.icon  } {fields.link.tile}</a>
                                                       </p>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </form>
                               )}

                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </section>
   </Fragment>
    )
}

export default Form;