import React, {FunctionComponent} from 'react';
import {ADS_IMAGE_URL} from "../../hooks/useConfig";
import Shipping from "../shipping/shipping";
import {calculateTotal, parsePrice} from "../../helpers/Buy";

interface PaymentRightProps {
    data: any;
    handleRadioChange: (e:any) => void
}
const PaymentRight: FunctionComponent<PaymentRightProps> = ({data, handleRadioChange}) => {
    return (
        <div className="right">
            <div className="right-header">
                                        <span className="image">
                                            <img src={`${data.item.imageUrl ? ADS_IMAGE_URL + data.item.imageUrl : "/assets/images/products/default-product.png"}`} alt=""/>
                                        </span>
                <span className="title">{data.item.title}</span>
                <span className="price"> {data.item.prices.price % 100 === 0 ? data.item.prices.price / 100 + ".00" : data.item.prices.price % 100} €</span>
            </div>
            <div className="content">
                <h2>Mode de remise</h2>

                {data.delivery_modes.display.ordering.includes(data.delivery_modes.display.selected) && (
                    <div className="item">
                        <Shipping
                            location={`${data.delivery_modes.face_to_face.city} (${data.delivery_modes.face_to_face.zipcode})`}
                            subtitle="Payez en ligne et récupérez votre achat en main propre lors de votre rendez-vous avec le vendeur"
                            title="Remise en main propre"
                            radio={true}
                            value="face-to-face"
                            data={data.delivery_modes.display.selected}
                            handleRadio={(e) => handleRadioChange(e)}
                        />
                    </div>
                )}

                {data.delivery_modes.display.ordering.includes("courrier-suivi") && data.delivery_modes.display.ordering.includes(data.delivery_modes.display.selected) && (
                    <div className="item">
                        <Shipping
                            icon="/assets/images/svg/laposte.svg"
                            price={parsePrice(data.delivery_modes.courrier_suivi.prices.price)}
                            subtitle="à votre domicile sous 2-3 jours"
                            title="Courrier suivi"
                            radio={true}
                            value="courrier-suivi"
                            data={data.delivery_modes.display.selected}
                            handleRadio={(e) => handleRadioChange(e)}
                        />
                    </div>
                )}


                {data.delivery_modes.display.ordering.includes("mondial-relay") && data.delivery_modes.display.ordering.includes(data.delivery_modes.display.selected)&& (
                    <div className="item">
                        <Shipping
                            icon="/assets/images/svg/mondialrelay.svg"
                            price={parsePrice(data.delivery_modes.mondial_relay.prices.price)}
                            subtitle="en point Mondial Relay sous 3-5 jours"
                            title="Mondial Relay"
                            radio={true}
                            data={data.delivery_modes.display.selected}
                            value="mondial-relay"
                            handleRadio={(e) => handleRadioChange(e)}
                        />
                    </div>
                )}

                <div className="item">
                    <Shipping
                        price={data.delivery_modes.display.ordering.length > 0 && parsePrice(data.item.prices.buyer_fees) > 1 ? parsePrice(data.item.prices.buyer_fees): 2}
                        subtitle="Votre argent est conservé jusqu’à la confirmation de réception de votre achat"
                        title="Protection Sandaga"
                    />
                </div>
            </div>
            <div className="footer">
                <span>Total</span>
                <span>{calculateTotal(data.item.prices, data.delivery_modes.display,  data.delivery_modes.mondial_relay && data.delivery_modes.mondial_relay.prices.price, data.delivery_modes.courrier_suivi && data.delivery_modes.courrier_suivi.prices.price)} €</span>
            </div>
        </div>
    );
};

export default PaymentRight;