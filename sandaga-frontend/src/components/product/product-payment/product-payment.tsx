import React, {Fragment, FunctionComponent, useEffect, useState} from 'react';
import "./product-payment.style.scss";
import moment from "moment";
import 'moment/locale/fr'
import {State} from "../../../redux/types";
import {connect, ConnectedProps, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {processCharge} from "../../api/api-order";
import LightboxShipping from "../../lightbox/lightbox-shipping/lightbox-shipping";

export interface PaymentType {
    ads: {
        estimated_weight: number;
        id: string;
        imageUrl: string;
        prices: number;
        title: string
    }
    amount: number;
    buyer: {
        first_name: string
        id: string
        last_name: string
        phone_number:string;
        stripeCustomerId: string;
    }
    createdAt: Date,
    delivery_mode: string
    id: string;
    labelUrl: string;
    expNumber: string;
    purchaseId: string
    seller: {
        id: string
        name: string;
        status: string
    },
    status: string;
    shippingStep: {
        step: string;
        status: string;
        selected: string;
        expireDate: Date;
    }[];
    shippingStatus: string;
    shippingAddress: {
        street: string;
        pincode: string;
        city: string;
    }
}


interface ProductPaymentProps {
    payment: PaymentType;
    key: number;
    handleLightBox: (e: any, payment: PaymentType) => void;
}

const api_stripe_key = "pk_test_51OL0lfBgShgavqcgl9y81hkqIpM7rkgZ3FUf5MhSXdXkbW2tiqZB9gQC9hD9lRAgd9TLc9zZZRwWRbMJGitwXEQP00dGOo3lvm";

const ProductPayment: FunctionComponent<ProductPaymentProps> = ({payment, key, handleLightBox}) => {
    moment.locale('fr')
    const [error, setError] = useState<string>("");
    const [stripe, setStripe] = useState<any>(null)
    const [paymentType, setPaymentTYpe] = useState<string | null>(null);
    const { credentials } = useSelector((state: any) => state.auth);

    useEffect(() => {
        console.log(payment && payment.buyer.id === credentials["userId"])
        if (payment && payment.buyer.id === credentials["userId"]) {
            setPaymentTYpe("Achat")
        }else {
            setPaymentTYpe("Vente")
        }
    }, [payment]);

    useEffect(() => {

        var stripe = window.Stripe && window.Stripe(api_stripe_key);

        setStripe(stripe);

    }, []);

    return (
       <Fragment>
           <li key={key}>
               <ul>
                   <li className="name">
                       <span className="name-holder">{`#${payment.purchaseId}`}</span>
                   </li>
                   <li className="data">
                       <span className="data-holder">{moment(payment.createdAt).calendar()}</span>
                   </li>
                   <li className="data">
                       <span className="data-holder">{paymentType}</span>
                   </li>

                   <li className="data">
                       <span className="data-holder">{payment.status === "cancel" ? "Annulé": payment?.status === "suspend" ? "Suspendue": payment?.status === "pay" ? "Payer": "Encours"}</span>
                   </li>

                   <li className="total">
                       <span className="total-holder">{payment.amount + "€"}</span>
                   </li>
                   <li className="actions">
                       <ul>
                           <li>
                               <Link
                                   to="@#"
                                   className="btn btn-primary"
                                   onClick={(e) => handleLightBox(e, payment)}
                                  /* onClick={(e) => handleStatusChange(e, payment.id, payment.buyer.id)}*/
                               >
                                   <i className="fa fa-truck"></i> livraison
                               </Link>
                           </li>
                       </ul>
                   </li>
               </ul>
           </li>
       </Fragment>
    );
};


export default ProductPayment;