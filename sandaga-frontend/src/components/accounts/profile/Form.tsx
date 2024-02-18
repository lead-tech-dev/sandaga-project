import React, {
    FunctionComponent,
    RefObject,
    useEffect,
    useState
} from "react";
import {FormDataInterface, FormInterface, RulesInterface} from "../../../interfaces/form.interface";
import SectionTitle from "../../section-title/section-title";
import Input from "../../Input";
import Check from "../../../assets/icons/Check";
import {GlobalsActionTypes} from "../../../redux/types/globals.type";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import {useNavigate, useSearchParams} from "react-router-dom";
import Radio from "../../Radio";
import {Dispatch} from "redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import {
    addUserAddress, deleteUser,
    sendUserModifyEmail,
    updateUserAddress,
    updateUserEmail,
    updateUserInfo
} from "../../../redux/actions/auth.actions";
import {State} from "../../../redux/types";
import {deleteImage, updateImage, uploadImage} from "../../../redux/actions/image.actions";
import {ADS_IMAGE_URL} from "../../../hooks/useConfig";
import {CredentialsProps} from "../../../redux/reducers/auth.reducer";
import InputLocation from "../../inputs/input-location";


const Form: FunctionComponent<FormInterface & FormProps> = (
    {
        deleteImage,
        updateImage,
        uploadImage,
        updateUserInfo,
        sendUserModifyEmail,
        updateUserEmail,
        updateUserAddress,
        addUserAddress,
        deleteUser,
        auth: {update_success, update_loading, errors,  credentials},
        address, setSuggestions, handleSearch, suggestions,  fields})  => {
    const [inputRef, setInputRef] = useState<RefObject<HTMLInputElement>[]>([]);
    const [formErrRegexp, setFormErrRegexp] = useState<FormDataInterface | null>(null);
    const [formData, setFormData] = useState<FormDataInterface | null>(null);
    const [current, setCurrent] = useState<string | null>(null);
    const [checked, setChecked] = useState<boolean>(false)
    const [typing, setTyping] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>(null)
    const inputEmailRef = React.useRef<HTMLDivElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const code = searchParams.get("code")
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fieldsLength = fields.fields.length;

        !formData && ( fields.fields.forEach(item => {
            if (item.name === "address" && credentials && credentials["address"]) {
                setFormData((prevState) => ({...prevState, [item.name]:
                        `${credentials["address"]["number"]}  ${credentials["address"]["street"]}, ${credentials["address"]["pincode"]} ${credentials["address"]["city"]},${credentials["address"]["country"]}`}
                    )
                )
            } else  if (code && item.name === "email"){
                setFormData((prevState) => ({...prevState, [item.name]: ""}))
            }else  {

               credentials && setFormData((prevState) => ({...prevState, [item.name]: credentials[item.name as keyof CredentialsProps]}))
            }
        }))


        // Update Email process
        if(update_success && current === "email" && fields.name === "Email") {
            setMessage("Un email de modification de l'email vous a été envoyé")
            setTimeout(() => {
                dispatch({type: GlobalsActionTypes.CLEAR_ERRORS})
                setMessage(null);
            }, 5000)
        }

        if(update_success && current === "email" && fields.name === "Nouvel Email") {
            setMessage("Email modifié avec success")
            setTimeout(() => {
                dispatch({type: GlobalsActionTypes.CLEAR_ERRORS})
                navigate("/dashboard")
                setCurrent(null);
                setMessage(null)
            }, 5000)
        }

        if(fields.fields[0].name === "email" && errors && Object.keys(errors).length > 0 ){

            setMessage(String(errors["message"]).split(".")[1])

            setTimeout(() => {
                dispatch({type: GlobalsActionTypes.CLEAR_ERRORS})
                navigate("/dashboard", {replace: true})
                credentials && setFormData((prevState) => ({...prevState, email: credentials["email"]}))
                setMessage(null);
                setCurrent(null);
            }, 5000)
        }

        if (code) {
            let element = document.getElementById("inputEmailRef")
            element?.scrollIntoView({ behavior: 'smooth', block: 'center'});
        }

        // Update address Process
        if(update_success && current === "address") {
            setMessage("Addresse mise à jour avec success")
            setTimeout(() => {
                dispatch({type: GlobalsActionTypes.CLEAR_ERRORS})
                setMessage(null);
                setCurrent(null);
            }, 5000)
        }

        if(fields.name === "address" && current === "address" && errors && Object.keys(errors).length > 0 ){
            setMessage("Une erreur s'est produite. Veillez recommencer plutard!")

            setTimeout(() => {
                dispatch({type: GlobalsActionTypes.CLEAR_ERRORS})
                navigate("/dashboard", {replace: true})
                credentials && setFormData((prevState) => ({...prevState, address: credentials["address"]}))
                setMessage(null)
                setCurrent(null);
            }, 5000)
        }

        // Update info process
        if(update_success && current === "info") {
            setMessage("Info mis à jour avec success")
            setTimeout(() => {
                dispatch({type: GlobalsActionTypes.CLEAR_ERRORS})
                setMessage(null);
                setCurrent(null);
            }, 5000)
        }

        if(fields.name === "Info" && current === "info" && errors && Object.keys(errors).length > 0 ){
            setMessage("Une erreur s'est produite. Veillez recommencer plutard!")

            setTimeout(() => {
                dispatch({type: GlobalsActionTypes.CLEAR_ERRORS})
                navigate("/dashboard", {replace: true})
                credentials && setFormData((prevState) => ({...prevState,
                    firstname: credentials["firstname"],
                    lastname: credentials["lastname"],
                    civility: credentials["civility"],
                    hidePhone: credentials["hidePhone"],
                    phone: credentials["phone"]
                }))
                setMessage(null);
                setCurrent(null);
            }, 5000)
        }

        return () => {

        }
    }, [errors, update_success, formData?.address, address, code, current ])

    const handleCheckbox = (e: any) => {
        const {name} = e.target;
        setFormData((prevState) => ({...prevState, [name]: prevState && !prevState["hidePhone"]}))
    }
    const handleRadio = (e: any) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({...prevState, [name]: value}))
    }
    const handleInputChange = (e: any, rules: RulesInterface) => {
        const {name, value} = e.currentTarget;
        const regex = new RegExp(rules.regexp);

        if (regex && regex.test(value)) {
            setFormErrRegexp((prevState) => ({...prevState, [name]: ""}));
            if (value.length < 3) {
                setFormData((prevState) => ({...prevState, [name]: value}))
                setTyping(false)
            }else {
                setFormData((prevState) => ({...prevState, [name]: value}))
            }
        } else {
            setFormErrRegexp((prevState) => ({...prevState, [name]: rules.err_regexp}));
            setFormData((prevState) => ({...prevState, [name]: value}))
            if (value.length < 3) {
                setTyping(false)
            }
        }

        setTyping(true)

    }

    const handleBlur = (e: any, rules: RulesInterface) => {
        const {name, value} = e.currentTarget;

        if (formData  && formData[name as keyof  FormDataInterface]  === "") {
            setFormErrRegexp((prevState) => ({...prevState, [name]: rules.err_mandatory}));
            setFormData((prevState) => ({...prevState, [name]: value}))
        }
    };


    const handleImageChange = (e: any) => {
        const file = e.target.files[0];

        setCurrent("image")

        if (credentials && credentials["image"] !== null) {
            updateImage(file, credentials["image"]["id"]);
        }else {
            credentials &&  uploadImage(file, null, credentials["userId"]);
        }

    };

    const handleEditPicture = (e: any) => {
        e.preventDefault();
        const fileInput = document.getElementById('imageInput');
        fileInput && fileInput.click();
    };
    const handleDeletePicture = (e: any) => {
        e.preventDefault();
        credentials && deleteImage(credentials["image"]["id"], "user");
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        let isEmptyFields = false as  boolean

        formData && Object.keys(formData).length > 0 && Object.keys(formData).filter(item => item !== "hidePhone" && item !== "civility").forEach((item, index) => {
            if(formData[item] === "") {
                const currentRules = fields.fields.find(rule => rule.name === item)?.rules
                currentRules && setFormErrRegexp((prevState) => ({...prevState, item: currentRules.err_mandatory}));

                inputRef[index].current?.focus()
                inputRef[index].current?.blur()
                isEmptyFields = true;
            }
        })

        if (fields.name === "Email") {
            formData && setCurrent("email")
            sendUserModifyEmail();
        }

        if (fields.name === "Nouvel Email" && formData && code) {
            formData && setCurrent("email")
            updateUserEmail({email: formData.email, code: code})
        }

        if (fields.name === "Address" ) {
            let address = formData && formData.address.split(",");
            formData && setCurrent("address")
                //updateUserEmail({email: formData.email, code: code})

            if (address) {
                let number = "";
                let street =  address[0];
                let city = address[1].split(" ").length > 3 ? address[1].split(" ")[2] + " " + address[1].split(" ")[3] : address[1].split(" ")[2] ? address[1].split(" ")[2] : "";
                let pincode = address[1].split(" ")[1] ? address[1].split(" ")[1]: "";
                let country = address[2] ? address[2]: "";
                let state = ""

                if (credentials && credentials["address"]) {
                    let id: string = credentials["address"]["id"];
                    updateUserAddress({id, number, street, pincode, city, state, country})
                }else {
                   addUserAddress({number, street, pincode, city, state, country})
                }


            }

        }

        if (fields.name === "Info") {
            setCurrent("info")
           formData && updateUserInfo({...formData});
        }

        if (fields.name === "Delete") {
            setCurrent("delete")
            deleteUser();
        }

    };

    return(
        <form id="login-page-form" noValidate  onSubmit={handleSubmit}>
            <div className="account-block ">
                <div className="hr" />
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="section-header text-center pb-0">
                            <SectionTitle
                                titleText={fields.title}
                                positionClass="justify-content-center"
                                spaceClass="mb-55"
                            />
                            {fields.name === "Delete" && (
                                <span className="caption-header">
                Voulez-vous vraiment supprimer ce compte? Toutes vos données
                seront définitivement supprimées.
              </span>
                            )}
                            <div className="message mb-5">
                                {update_success && current === "info" && <span className="success">{message && message}</span>}
                                {update_success && current === "email" && <span className="success">{message && message}</span>}
                                {update_success && current === "address" && <span className="success">{message && message}</span>}
                            </div>
                        </div>
                    </div>
                </div>
                {fields.fields.filter(item => item.type === "file").map((field, index) => {

                    return(

                        <div className="col-12 ">
                            <div className="text-center">
                                <form className="md-form">
                                    <div className="file-field">
                                        <div className="mb-4">
                                            <LazyLoadImage width={"100%"} height={"100%"} effect="blur"
                                                src={`${credentials && credentials["image"] ? ADS_IMAGE_URL + credentials["image"]["name"] : "/assets/images/svg/avatar.svg" }`}
                                                className="rounded-circle  avatar"
                                                alt=""
                                            />
                                            <input
                                                name={field.name}
                                                type={field.type}
                                                id={field.id}
                                                hidden={field.hidden}
                                                onChange={(e) => handleImageChange(e)}
                                                value=""
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                })}

                {fields.fields.filter(item => item.type === "radio").map((field, index) => {

                    return(

                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6 ">
                            <div className="row">
                                {
                                    field.values?.map((item, index) => (
                                        <div className="col-12 col-md-4">
                                            <div className="form-group">
                                                <Radio
                                                    name={field.name}
                                                    value={item.value}
                                                    label={item.label}
                                                    selected={formData && formData["civility"] === "Mr" ? "Mr" : formData && formData["civility"] === "Mme" ? "Mme" : ""}
                                                    handleRadioClick={(e) => handleRadio(e)}/>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    )
                })}


                {fields.fields.filter(item => item.name === "address").map((field, index) => {
                    return (
                        <div className="row justify-content-center mb-5" key={index}>
                            <div className="col-12 col-md-6">
                                <InputLocation
                                    field={field}
                                    handleAddress={(addr) =>  setFormData((prevState) => ({...prevState, address: `${addr.street}, ${addr.pincode} ${addr.country ? addr.city + ","  : addr.city} ${addr.country}`}))}
                                    handleInputAddressChange={(e, rules) => handleInputChange(e, rules)}
                                    formData={formData ? formData[field.name as keyof FormDataInterface] : null}
                                    styleClass="shadow"
                                    typing={typing}
                                    handleTyping={() => setTyping(false)}
                                />
                            </div>
                        </div>
                    )
                })}
                {fields.fields.filter(item => item.name !== "address" && item.type !== "radio" && item.type !== "checkbox" && item.name !== "email" && item.type !== "file" && item.name !== "delete").map((field, index) => {
                    return(
                        <div className="row justify-content-center" key={index} >
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
                    )
                })}

                {fields.fields.filter(item =>  item.name === "email").map((field, index) => {
                    return(
                        <div className="row justify-content-center" key={index} id={"inputEmailRef"}>
                            <div className="col-12 col-md-6">
                                <div className="form-group" >
                                    <div className="message">
                                        {errors && current === "email" && Object.keys(errors).length > 0 &&  <span className="error-update">{message && message}</span>}
                                    </div>
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
                                            maxLength: field.rules.max_length,
                                            readOnly: field.rules.readonly
                                        }}
                                        handleChange={(e) => handleInputChange(e, field.rules)}
                                        onBlur={(e) => handleBlur(e, field.rules)}
                                    />

                                </div>
                            </div>
                        </div>
                    )
                })}

                {fields.fields.filter(item => item.type === "checkbox").map((field, index) => {

                    return(

                        <div className="row justify-content-center">
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label className="form-control">
                                        <div className="checkbox">
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={formData && formData["hidePhone"] ? formData["hidePhone"] : String(false)}
                                                checked={formData && formData["hidePhone"] ? Boolean(formData["hidePhone"]) : false}
                                                onChange={(e) => handleCheckbox(e)}
                                            />
                                            <Check />
                                        </div>
                                        <span>
                        Masquer votre numéro à la publication de l'annonce
                      </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )
                })}


                <div className="row justify-content-center">
                    <div className={`col-12 ${fields.name === "Image" && credentials && credentials["image"] ? "col-md-3" : "col-md-6"}`}>
                        <div className="text-center">
                            <button
                                onClick={(e) => fields.name === "Image" && handleEditPicture(e)}
                                type="submit"
                                className="btn btn-primary full-width"
                                disabled={(
                                    formErrRegexp &&( formErrRegexp["firstName"] ||
                                        formErrRegexp["lastName"] ||
                                        formErrRegexp["email"] ||
                                        formErrRegexp["phone"] ||
                                        formErrRegexp["password"])) ? true  : !!(formData && (current === "email" && update_loading ) || (current === "address" && update_loading) || (current === "info" && update_loading ) || (current === "image" && update_loading) || (current === "delete" && update_loading))}
                            >
                                {fields.btn}
                            </button>

                        </div>
                    </div>
                    {
                        fields.name === "Image" && credentials && credentials["image"]  && (

                            <div className="col-12 col-md-3">
                                <div className="text-center">
                                    <button
                                        onClick={(e) =>  handleDeletePicture(e)}
                                        type="submit"
                                        className="btn btn-primary full-width"
                                        disabled={!!update_loading && current === "delete"}
                                    >
                                        Supprimer
                                    </button>

                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </form>
    )
}

const mapStateToProps = (state: State) => ({
    auth: state.auth,
    images: state.images
});


const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    sendUserModifyEmail: () => dispatch(sendUserModifyEmail()),
    updateUserEmail: (data: {email: string, code: string}) => dispatch(updateUserEmail(data)),
    updateUserAddress: (data: {id: string, number: string, pincode: string, street: string, city: string; state: string; country: string}) => dispatch(updateUserAddress(data)),
    addUserAddress: (data: {number: string, pincode: string, street: string, city: string; state: string; country: string}) => dispatch(addUserAddress(data)),
    updateUserInfo: (data: {[key: string]: string}) => dispatch(updateUserInfo(data)),
    uploadImage: (file: File, adsId: string | null, userId: string | null) => dispatch(uploadImage(file, adsId, userId)),
    updateImage: (file: File, imageId: string ) => dispatch(updateImage(file, imageId)),
    deleteImage: (id: string , type: string) => dispatch(deleteImage(id, type)),
    deleteUser: () => dispatch(deleteUser())
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type FormProps = ConnectedProps<typeof connector>;

export default connector(Form)