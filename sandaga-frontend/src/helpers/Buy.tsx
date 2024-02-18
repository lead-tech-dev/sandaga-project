import {formDataProps} from "../components/payment/payment-left";
import {PaymentType} from "../components/product/product-payment/product-payment";
import shipping from "../components/shipping/shipping";

export interface RelayResponseProps {
    enseigne: string,
    cp: string,
    ville: string,
    address: string,
    hours: {[key: string]: string}
    location: {lng: number; lat: number}
    information: string
    distance: string
    relayId: string;
}
const parseHours = (hour: {"string": string[]}): string => {
    let response = "";
    if (hour.string.length === 4) {
        if (hour.string[0] !== "0000" && hour.string[1] !== "0000" && hour.string[2] !== "0000" && hour.string[3] !== "0000") {
            response = response + hour.string[0].slice(0, 2) + "h" + hour.string[0].substring(2) + " - " + hour.string[1].slice(0, 2) + "h" + hour.string[1].substring(2);
            response = response + " " + hour.string[2].slice(0, 2) + "h" + hour.string[2].substring(2) + " - " + hour.string[3].slice(0, 2) + "h" + hour.string[3].substring(2)
        }
        if (hour.string[0] !== "0000" && hour.string[1] !== "0000" && hour.string[2] === "0000" && hour.string[3] === "0000"){
            response = response + hour.string[0].slice(0, 2) + "h" + hour.string[0].substring(2) + " - " + hour.string[1].slice(0, 2) + "h" + hour.string[1].substring(2);
        }

        if (hour.string[0] === "0000" && hour.string[1] === "0000" && hour.string[2] !== "0000" && hour.string[3] !== "0000") {
            response = hour.string[2].slice(0, 2) + "h" + hour.string[2].substring(2) + " - " + hour.string[3].slice(0, 2) + "h" + hour.string[3].substring(2)
        }
    }
    return response;
}
export const parseRelayData = (data: any): RelayResponseProps[] => {
    let response = [] as RelayResponseProps[];

    data.forEach((item: any, _: number) => {
        response.push({
            enseigne: item.lgAdr1,
            cp: item.cp,
            ville: item.ville,
            address: item.lgAdr3,
            location: {lng: String(item.longitude).startsWith("0") ? parseFloat(String(item.longitude).substring(1).replace(",", ".")): parseFloat(String(item.longitude).replace(",", ".")) , lat: parseFloat(String(item.latitude).replace(",", "."))},
            information: item.information,
            distance: item.distance,
            hours: {
                lundi: parseHours(item.horairesLundi),
                mardi: parseHours(item.horairesMardi),
                mercredi: parseHours(item.horairesMercredi),
                jeudi: parseHours(item.horairesJeudi),
                vendredi: parseHours(item.horairesVendredi),
                samedi: parseHours(item.horairesSamedi),
                dimanche: parseHours(item.horairesDimanche),
            },
            relayId: item.num
        })
    })
    return response;
}

export const parsePrice = (price: number): number => {
    return price % 100 === 0 ? parseInt(price / 100 + ".00") : price / 100
}

export const toPaymentReq = (formData: {[key: string]: string}): formDataProps => {
    let data = {} as formDataProps;

    console.log(formData)

    data = {
        ...data,
        buyerId: formData["buyer_id"],
        subject: formData["subject"],
        deliveryMode: formData["delivery_mode"],
        purchaseId: formData["purchaseId"].toString(),
        amount: formData["amount"]
    }

    if ( formData["delivery_mode"] === "mondial-relay") {
        data = {...data,
            relayId: formData["relayId"],
            shippingAddress: {
                firstName: formData["firstName"],
                lastName: formData["lastName"],
                address: formData["relayAddress"],
                city: formData["city"],
                pincode: formData["pincode"],
                country: formData["country"],
                phone: formData["phone"],
            }
        }
    }

    if ( formData["delivery_mode"] === "courrier-suivi") {
        data = {...data,
            shippingAddress: {
                firstName: formData["firstName"],
                lastName: formData["lastName"],
                address: formData["address"],
                city: formData["city"],
                pincode: formData["pincode"],
                country: formData["country"],
                phone: formData["phone"],
            }}
    }

    return data;
}

export const calculateTotal = (priceItem: {buyer_fees: number; price: number}, display: any, relay?: number, suivi?: number): number => {
    let total: number =   priceItem.price ;


    if (relay && display.selected === "mondial-relay") {
        total = total + relay;
    }
    console.log()

    if (suivi &&  display.selected === "courrier-suivi") {
        total = total + suivi
    }

    total = parsePrice(total) + (parsePrice(priceItem.buyer_fees) > 2 ? parsePrice(priceItem.buyer_fees) : 2)

    return Number(total.toFixed(2));
}

export const isDisabledTimeline = (payment: PaymentType, step: number): boolean => {
   let disabled = false;

    sort(payment.shippingStep)

    payment.shippingStep.forEach(item => {

        if (step === 1 && (payment.status === "cancel")) {
            disabled = true;
        }

        if (step === 2 && (payment.status === "cancel" || payment.shippingStep.length < 2 || payment.shippingStep.length > 1 &&
            payment.shippingStep[0].status !== "available")) {
            disabled = true;
        }


        if (step === 3 && (payment.status === "cancel" || payment.shippingStep.length < 3 || payment.shippingStep.length > 1 &&
            payment.shippingStep[1].status !== "send")) {
            disabled = true;
        }

        if (step === 4 && (payment.status === "cancel" || payment.shippingStep.length < 4 || payment.shippingStep.length > 2 &&
            payment.shippingStep[2].status !== "receive")) {
            disabled = true;
        }
    })


    return disabled;
}

export const isDisabledSelect = (payment: PaymentType, step: number): boolean => {
    let disabled = false;

    sort(payment.shippingStep)

    payment.shippingStep.forEach(item => {

        if (step === 1 && (payment.status === "cancel" || payment.shippingStep.length > 0  &&
            payment.shippingStep[0].status === "available")) {
            disabled = true;
        }

        if (step === 2 && (payment.status === "cancel" ||  payment.shippingStep.length < 2 || payment.shippingStep.length > 0 &&
            payment.shippingStep[0].status !== "available" || payment.shippingStep.length > 1 && payment.shippingStep[1].status === "send")) {
            disabled = true;
        }

        if (step === 3 && (payment.status === "cancel" || payment.shippingStep.length < 3 || payment.shippingStep.length > 1 &&
            (payment.shippingStep[1].status !== "send" || payment.shippingStep.length > 2 && payment.shippingStep[2].status === "receive"))) {
            disabled = true;
        }

        if (step === 4 && (payment.status === "cancel" || payment.shippingStep.length < 4 || payment.shippingStep.length > 2 &&
            (payment.shippingStep[2].status !== "receive" || payment.shippingStep.length > 3 && payment.shippingStep[3].status === "paid"))) {
            disabled = true;
        }
    })

    return disabled;
}

export const isExpired = (payment: PaymentType | null, step: number, removeDays?: number): boolean => {

    payment && sort(payment.shippingStep);

    //console.log(new Date("2023-12-20T10:32:52.738+00:00"))
    //console.log(new Date().getTime() > new Date("2023-12-20T10:32:52.738+00:00").getTime())
    const minutes = removeDays ? removeDays * 60 * 1000 : 0;


    if (payment && payment.shippingStep[step - 1] && payment.shippingStep[step - 1].expireDate && new Date().getTime() < new Date(payment.shippingStep[step - 1].expireDate).getTime() - minutes) {
        return true;
    }
    return false;
}
export const sort = (shippingStep: any): any => {

    return shippingStep.sort((step1: any, step2: any) => parseInt(step1.step) > parseInt(step2.step) ?
        1 : parseInt(step1.step) < parseInt(step2.step) ? -1 : 0
    )
}

