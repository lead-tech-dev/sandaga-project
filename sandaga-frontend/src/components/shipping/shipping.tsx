import React, {FunctionComponent} from 'react';
import "./shipping.style.scss";
import Radio from "../Radio";
import Location from "../../assets/icons/Location";
interface ShippingProps {
    title: string;
    subtitle: string;
    icon?: string;

    price?: number
    radio?: boolean;
    location?: string;
    handleRadio?: (e: any) => void;
    data?: string;
    value?: string
}
const Shipping: FunctionComponent<ShippingProps> = ({value, data, handleRadio, location, radio, title, subtitle, icon, price}) => {
    return (
        <div className={`shipping-wrapper  ${radio ? "radio" : ""}`}>

            {radio && (
                <div className="shipping-wrapper__radio">
                    <Radio name="shipping" value={value ? value : ""} label="" selected={data ? data : ""} handleRadioClick={handleRadio ? (e) => handleRadio(e): (e) => console.log(e)}/>
                </div>
            )}

           <div className="shipping-wrapper__info">
               <div className="header">
                   <h3>{title} {icon && <img src={icon} alt=""/>}</h3>
                   {price && (
                       <>
                           <span className="hr"></span>
                           <span className={`price ${data === value ? "active" : ""}`}>{price} €</span></>
                   )}
               </div>
               <div className="details">
                   {location && (
                       <p className="location"><Location/> {location}</p>
                   )}
                   <p>{subtitle}</p>
               </div>
           </div>
        </div>
    )
};

export default Shipping;