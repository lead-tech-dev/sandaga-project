
import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import InputLocation from "../inputs/input-location";
import Relay from "./relay";
import Button from "../Button";
import Input from "../Input";
import {Fields, FormDataInterface, FormFieldsInterface, RulesInterface} from "../../interfaces/form.interface";
import {calculateTotal, parseRelayData, RelayResponseProps} from "../../helpers/Buy";
import Checkout from "./checkout";
import {StripeProvider} from "react-stripe-elements";
import {headersWithAuthorization, RELAY_URL} from "../../hooks/useConfig";
import LightboxRelay from "../lightbox/lightbox-relay/lightbox-relay";
import {AuthData} from "../../data/data";
import {FieldsInterface} from "../../interfaces/ads.interface";

interface wSI4_PointRelais_RechercheProps {
    enseigne: string
    pays: string
    ville: string,
    cp: string,
    nombreResultats: string
}

const paymentLeft = {
    fields: [
        {
            name: "firstname",
            label: "Nom",
            placeholder: "Nom",
            type: "text",
            id: "firstname",
            max_length: 20,
            rules: {
                err_mandatory: "Veuillez insérer un nom",
                err_regexp: "Votre nom doit contenir au moins 2 caractères",
                mandatory: false,
                max_length: 20,
                regexp: "[^\\s].*[^\\s]",
            },
        },
        {
            name: "lastname",
            placeholder: "Prénom",
            type: "text",
            id: "lastname",
            max_length: 20,
            rules: {
                err_mandatory: "Veuillez insérer un prénom",
                err_regexp: "Votre prénom doit contenir au moins 2 caractères",
                mandatory: false,
                max_length: 20,
                regexp: "[^\\s].*[^\\s]",
            },
        },
        {
            name: "pincode",
            placeholder: "Code postal",
            type: "text",
            id: "pincode",
            max_length: 20,
            rules: {
                err_mandatory: "Veuillez insérer un code postal",
                err_regexp: "",
                mandatory: true,
                max_length: 20,
                regexp: "[^\\s].*[^\\s]",
            },
        },
        {
            name: "address",
            placeholder: "Addresse",
            type: "text",
            id: "address",
            rules: {
                err_mandatory: "Veuillez insérer une addres",
                err_regexp: "Votre address doit contenir au moins 2 caractères",
                mandatory: true,
                max_length: 20,
                regexp: "[^\\s].*[^\\s]",
            },
        },
        {
            name: "address-complement",
            placeholder: "Complément d'addresse",
            type: "text",
            id: "address-complement",
            rules: {
                err_mandatory: "",
                err_regexp: "",
                mandatory: false,
                max_length: 20,
                regexp: "",
            },
        },
        {
            name: "phone",
            placeholder: "Téléphone",
            type: "tel",
            id: "phone",
            rules: {
                err_mandatory: "Veuillez insérer un numéro de téléphone",
                err_regexp:
                    "Votre numéro de téléphone doit comporter 10 chiffres, sans espace ni séparateur",
                mandatory: false,
                max_length: 13,
                regexp: "^(\\d{10}|\\+\\d\\d\\|\\d{8,9})$",
            },
        },
        {
            name: "city",
            placeholder: "Ville",
            type: "text",
            id: "city",
            max_length: 20,
            rules: {
                err_mandatory: "Veuillez insérer une ville",
                err_regexp: "",
                mandatory: true,
                max_length: 20,
                regexp: "[^\\s].*[^\\s]",
            },
        },
        {
            name: "country",
            placeholder: "Pays",
            type: "text",
            id: "country",
            max_length: 20,
            rules: {
                err_mandatory: "Veuillez insérer une pays",
                err_regexp: "",
                mandatory: true,
                max_length: 20,
                regexp: "[^\\s].*[^\\s]",
            },
        },
    ],
}

export interface formDataProps {
    token: string;
    buyerId: string
    subject: string
    deliveryMode: string
    purchaseId: string
    amount: string
    relayId: string;
    shippingAddress: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        pincode: string;
        country: string;
        phone: string;
    }
}

interface InfoProps {
    selected: string;
    data: any,
}

const api_stripe_key = "pk_test_51OL0lfBgShgavqcgl9y81hkqIpM7rkgZ3FUf5MhSXdXkbW2tiqZB9gQC9hD9lRAgd9TLc9zZZRwWRbMJGitwXEQP00dGOo3lvm";
const PaymentLeft: FunctionComponent<InfoProps> = ({selected, data}) => {
    const inputRef = useRef(null);
    const [formErrRegexp, setFormErrRegexp] = useState<FormDataInterface | null>(null);
    const [relayData, setRelayData] = useState<RelayResponseProps[] >([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [address, setAddress] = useState<boolean>(false);
    const [typing, setTyping] = useState<boolean>(false)
    const [formData, setFormData] = useState<FormDataInterface | null>(null);
    const [more, setMore] = useState<{size: number, more: boolean}>({size: 5, more: false});
    const [selectedRelay, setSelectedRelay] = useState<RelayResponseProps | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [stripe, setStripe] = useState<any>(null)
    const [fields, setFields] = useState<Fields[]>(AuthData[11].fields)

    useEffect(() => {

        if (selected) {
            setFormData(null);
            setSelectedRelay(null)
            setFormData((prevState) => ({
                ...prevState,
                buyer_id: data.buyer.id,
                subject: data.item.title,
                delivery_mode: selected,
                purchaseId: data.id,
                amount: calculateTotal(data.item.prices, data.delivery_modes.display,  data.delivery_modes.mondial_relay && data.delivery_modes.mondial_relay.prices.price, data.delivery_modes.courrier_suivi && data.delivery_modes.courrier_suivi.prices.price).toString()
            }))

            if (selected !== "face-to-face") {
                setFormData((prevState) => ({...prevState,
                    firstName: data ? data.buyer.first_name: "",
                    lastName: data ? data.buyer.last_name: "",
                    phone: data ? data.buyer.phone_number: "",
                    pincode: data.buyer.address ? data.buyer.address.pincode: "",
                    city: data.buyer.address ? data.buyer.address.city: "",
                    address: "",
                    country: "France",
                }))
            }
        }
    }, [selected]);

    useEffect(() => {

        var stripe = window.Stripe && window.Stripe(api_stripe_key);

        setStripe(stripe);

    }, []);

    useEffect(() => {
        if (address && selected === "mondial-relay" && formData && formData.address) {
            let data: wSI4_PointRelais_RechercheProps =  {enseigne: "BDTEST13", pays: "FR", ville: "", cp: "", nombreResultats: "10"}
            let adr = formData.address.split(",")[1].split(" ")
            data = {...data, ville: adr[2], cp: adr[1]}


            if (Object.keys(data).length > 0) {
                ApiPointRelais_RechercheCall(data)
            }
        }

    }, [formData && formData.address, address]);

    const ApiPointRelais_RechercheCall = (data: wSI4_PointRelais_RechercheProps) => {
        setRelayData([])
        setLoading(true);
        fetch(RELAY_URL + "wSI4_PointRelais_Recherche",{
            method: "POST",
            mode: "cors",
            headers: {
                ...headersWithAuthorization(),
            },
            body: JSON.stringify(data)
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {

                if (response.ok){
                    setRelayData(parseRelayData(json))
                    setLoading(false)
                }else {
                    setRelayData([])
                    setLoading(false)
                }
            })
            .catch((err) => {
                // setLoading(false)
                console.log(err);
            });

    }
    const handleInputChange = (e: any, rules: RulesInterface) => {
        const {name, value} = e.currentTarget;

        const regex = new RegExp(rules.regexp);
        setAddress(false);
        if (regex && regex.test(value)) {

            setFormErrRegexp((prevState) => ({...prevState, [name]: ""}));
            setFormData((prevState) => ({...prevState, [name]: value}))
            if (value.length < 3) {
                setTyping(false)
                setRelayData([])
            }else {
                setTyping(true)
            }
        } else {
            setFormErrRegexp((prevState) => ({...prevState, [name]: rules.err_regexp}));
            setFormData((prevState) => ({...prevState, [name]: value}))

            if (value.length < 3) {
                setTyping(false)
                setRelayData([])
            }else {
                setTyping(true)
            }
        }


    }

    const handleBlur = (e: any, rules: RulesInterface) => {
        const {name, value} = e.currentTarget;


        if (formData  && formData[name as keyof  FormDataInterface]  === "") {
            setFormErrRegexp((prevState) => ({...prevState, [name]: rules.err_mandatory}));
            setFormData((prevState) => ({...prevState, [name]: value}))
        }
    };

    const handleLightBox = (e: any, index?: number) => {
        e.preventDefault()
        const lightbox = document.querySelector(".lightbox-relay");

        lightbox?.classList.toggle("open");

        index && setCurrentIndex(index)
    };


    return (
        <>
            {selected === "mondial-relay" && (
                <>
                    <div className="pickup-wrapper">
                        <p>1. Trouver les points Pickup autour de :</p>
                        <InputLocation
                            field={paymentLeft.fields[3]}
                            handleAddress={(addr) =>  {
                                setAddress(true)
                                 setFormData((prevState) => ({...prevState,  address: `${addr.street}, ${addr.pincode} ${addr.country ? addr.city + ","  : addr.city} ${addr.country}`}))
                            }}
                            handleInputAddressChange={(e, rules) => handleInputChange(e, rules)}
                            formData={formData && formData.address ? formData.address : null}
                            typing={typing}
                            handleTyping={() => setTyping(false)}
                        />

                        { !typing && loading ? (
                            <div className="loading">
                                <div className="spinner-border text-secondary mb-3 mt-5" role="status">
                                    <span className="sr-only">Chargement...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="relay-wrapper">
                                <div className="items">
                                    {relayData.length > 0 && (
                                        <>
                                            <p>Points relais autour de cette adresse:</p>
                                            {relayData.slice(0, more.size).map((item, index) => {
                                                return (
                                                    <Relay
                                                        value={selectedRelay ? selectedRelay.enseigne: ""}
                                                        relay={item}
                                                        handleLightBox={(e, currentIndex) => handleLightBox(e, currentIndex)}
                                                        index={index}
                                                        handleRadio={(relay) => {
                                                            setAddress(false)
                                                            setSelectedRelay(relay)
                                                            setFormData((prevState) => ({...prevState, relayAddress: relay.address, city: relay.ville, pincode: relay.cp, relayId: relay.relayId, poids: "10"}))
                                                        }}
                                                        data={selectedRelay}/>

                                                )
                                            })}
                                            <div className="bottom">
                                                <Button type="button" className="" onClick={() => setMore((prevState) => ({...prevState, size: prevState.size === 5 ? 10: 5, more: !prevState.more}))} label={more.more ? "Voir moins" : "Voir plus"}/>
                                            </div>
                                        </>
                                    )}

                                </div>
                            </div>
                        )}
                    </div>
                    <div className="info-wrapper">
                        <p>2. Informations personnelles</p>
                        <p>Une pièce d’identité vous sera demandée pour récupérer votre colis.</p>

                        <div className="row mb-5 mt-5">
                            <div className="col-12">
                                <Input data={{
                                    label: `${fields[0].placeholder} *`,
                                    type: "text",
                                    name: `${fields[0].name}`,
                                    id: `${fields[0].id}`,
                                    placeholder: `${fields[0].placeholder}`,
                                    value: `${formData && formData.firstName ? formData.firstName : ""}`,
                                    ref: inputRef,
                                }}
                                       handleChange={(e) => handleInputChange(e, fields[0].rules)}
                                />
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col-12">
                                <Input data={{
                                    label: `${fields[1].placeholder} *`,
                                    type: "text",
                                    name: `${fields[1].name}`,
                                    id: `${fields[1].id}`,
                                    placeholder: `${fields[1].placeholder}`,
                                    value: `${formData && formData.lastName ? formData.lastName : ""}`,
                                    ref: inputRef,
                                }}
                                       handleChange={(e) => handleInputChange(e, fields[1].rules)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <Input data={{
                                    label: `${fields[4].placeholder} *`,
                                    type: "text",
                                    name: `${fields[4].name}`,
                                    id: `${fields[4].id}`,
                                    value: `${formData && formData.phone ? formData.phone : ""}`,
                                    placeholder: `${fields[4].placeholder}`,
                                    ref: inputRef,
                                }}
                                   handleChange={(e) => handleInputChange(e, fields[4].rules)}
                                />
                            </div>
                        </div>
                    </div>

                </>
            )}

            {selected === "courrier-suivi" && (
                <div className="info-wrapper">
                    <p>1. Adresse de livraison</p>
                    <p>Transmise au vendeur pour l’envoi du courrier.</p>

                    <div className="row mb-5 mt-5">
                        <div className="col-12 col-md-6">
                            <Input data={{
                                label: `${fields[0].placeholder} *`,
                                type: "text",
                                name: `${fields[0].name}`,
                                id: `${fields[0].id}`,
                                placeholder: `${fields[0].placeholder}`,
                                value: `${formData && formData.firstName ? formData.firstName : ""}`,
                                ref: inputRef,
                                errRegexp: formErrRegexp && formErrRegexp[fields[0].name as keyof FormDataInterface],
                            }}
                                   onBlur={(e) => handleBlur(e, fields[0].rules)}
                                   handleChange={(e) => handleInputChange(e, fields[0].rules)}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <Input data={{
                                label: `${fields[1].placeholder} *`,
                                type: "text",
                                name: `${fields[1].name}`,
                                id: `${fields[1].id}`,
                                value: `${formData && formData.lastName ? formData.lastName : ""}`,
                                placeholder: `${fields[1].placeholder}`,
                                ref: inputRef,
                                errRegexp: formErrRegexp && formErrRegexp[fields[1].name as keyof FormDataInterface],
                            }}
                                   onBlur={(e) => handleBlur(e, fields[1].rules)}
                                   handleChange={(e) => handleInputChange(e, fields[1].rules)}
                            />
                        </div>
                    </div>

                    <div className="row mb-5">
                        <div className="col-12">
                            <Input data={{
                                label: `${fields[2].placeholder} *`,
                                type: "text",
                                name: `${fields[2].name}`,
                                id: `${fields[2].id}`,
                                value: `${formData && formData.address ? formData.address : ""}`,
                                placeholder: `${fields[2].placeholder}`,
                                ref: inputRef,
                                errRegexp: formErrRegexp && formErrRegexp[fields[2].name as keyof FormDataInterface],
                            }}
                                   onBlur={(e) => handleBlur(e, fields[2].rules)}
                                   handleChange={(e) => handleInputChange(e, fields[2].rules)}
                            />
                        </div>
                    </div>

                    <div className="row mb-5 mt-5">
                        <div className="col-12 col-md-6">
                            <Input data={{
                                label: `${fields[3].placeholder} *`,
                                type: "text",
                                name: `${fields[3].name}`,
                                id: `${fields[3].id}`,
                                placeholder: `${fields[3].placeholder}`,
                                value: `${formData && formData.pincode ? formData.pincode : ""}`,
                                ref: inputRef,
                                errRegexp: formErrRegexp && formErrRegexp[fields[3].name as keyof FormDataInterface],
                            }}
                                   onBlur={(e) => handleBlur(e, fields[3].rules)}
                                   handleChange={(e) => handleInputChange(e, fields[3].rules)}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <Input data={{
                                label: `${fields[5].placeholder} *`,
                                type: "text",
                                name: `${fields[5].name}`,
                                id: `${fields[5].id}`,
                                value: `${formData && formData.city ? formData.city : ""}`,
                                placeholder: `${fields[5].placeholder}`,
                                ref: inputRef,
                                errRegexp: formErrRegexp && formErrRegexp[fields[5].name as keyof FormDataInterface],
                            }}
                                   onBlur={(e) => handleBlur(e, fields[5].rules)}
                                   handleChange={(e) => handleInputChange(e, fields[5].rules)}
                            />
                        </div>
                    </div>

                    <div className="row mb-5 mt-5">
                        <div className="col-12 col-md-6">
                            <Input data={{
                                label: `${fields[6].placeholder} *`,
                                type: "text",
                                name: `${fields[6].name}`,
                                id: `${fields[6].id} `,
                                placeholder: `${fields[6].placeholder}`,
                                value: `${formData && formData.country && formData.country}`,
                                ref: inputRef,
                                readOnly: true,
                                errRegexp: formErrRegexp && formErrRegexp[fields[6].name as keyof FormDataInterface],
                            }}
                                   onBlur={(e) => handleBlur(e, fields[6].rules)}
                                   handleChange={(e) => handleInputChange(e, fields[6].rules)}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <Input data={{
                                label: `${fields[4].placeholder} *`,
                                type: "text",
                                name: `${fields[4].name}`,
                                id: `${fields[4].id}`,
                                value: `${formData && formData.phone ? formData.phone : ""}`,
                                placeholder: `${fields[4].placeholder}`,
                                ref: inputRef,
                                errRegexp: formErrRegexp && formErrRegexp[fields[4].name as keyof FormDataInterface],
                            }}
                                   onBlur={(e) => handleBlur(e, fields[4].rules)}
                                   handleChange={(e) => handleInputChange(e, fields[4].rules)}
                            />
                        </div>
                    </div>

                </div>
            )}

            {selected === "face-to-face" && (
                <div className="info-wrapper">
                    <p>1. Remise de l’achat en main propre</p>
                    <p>Les étapes de la remise en main propre :</p>

                    <div className="item">
                        <span className="counter">1</span>
                        <span className="text">Le vendeur vous confirme la disponibilité de la commande.</span>
                    </div>
                    <div className="item">
                        <span className="counter">2</span>
                        <span className="text">Vous vous organisez avec le vendeur pour définir le lieu et la date de votre rendez-vous.</span>
                    </div>
                    <div className="item">
                        <span className="counter">3</span>
                        <span className="text">Pensez à prendre votre téléphone portable pour déclencher le paiement depuis votre messagerie sandaga pendant le rendez-vous.</span>
                    </div>
                </div>
            )}

            <StripeProvider stripe={stripe}>
                <Checkout delivery_mode={data.delivery_modes.display.selected} formError={formErrRegexp} selectedRelay={!!selectedRelay} data={formData} handleFormErrRegexp={(data) => setFormErrRegexp((prevState) => ({...prevState, ...data}))}/>
            </StripeProvider>

            {relayData.length > 0 &&
                <LightboxRelay
                    items={relayData}
                    handleLightBox={(e) => handleLightBox(e)}
                    index={currentIndex}
                    handleSelectedRelay={(e, relay) => {
                        e.preventDefault();
                        setAddress(false)
                        setSelectedRelay(relay)
                        setFormData((prevState) => ({...prevState, relayAddress: relay.address, city: relay.ville, pincode: relay.cp, relayId: relay.relayId, poids: "10"}))
                        handleLightBox(e);
                    }}
                />
            }

        </>
    );
};

export default PaymentLeft;