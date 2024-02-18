import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import "./input-location.style.scss";
import Input from "../Input";
import { InputLocationField, RulesInterface } from "../../interfaces/form.interface";

interface AddressProps {number: string, street: string, pincode: string, state: string, city:string, country: string}
interface InputLocationProps {
    field: InputLocationField
    formData: string | null;
    handleAddress: (address: AddressProps) => void
    handleInputAddressChange: (e: any, rules: RulesInterface) => void
    index?: number;
    typing: boolean;
    handleTyping: () => void
    styleClass?: string;
}
const InputLocation: FunctionComponent<InputLocationProps> = ({ styleClass, handleTyping, typing, field, formData, handleAddress, handleInputAddressChange}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [suggestions, setSuggestions] = useState<any>(null)
    const token = "pk.eyJ1IjoibWF4aW1hbjgxIiwiYSI6ImNrZXBuaGE3ZTA0NXMycHI2NWoxcGx1cjEifQ.YIL3v3KgW2cmLB9e5lS_rA"
    const [selectedAddress, setSelectedAddress] = useState<string>("")
    useEffect(() => {

        if (formData && formData.length > 2) {
            handleSearch(formData)
        }

    }, [formData]);
    const handleSearch = async (event: string) => {

        try {
            // console.log(event)
            const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${event}.json?country=fr&proximity=ip&types=address&language=fr&access_token=${token}&autocomplete=true&limit=5`;

            const response = await fetch(endpoint);
            const results = await response.json();
            //console.log({results: results});
            setSuggestions(results?.features);

        } catch (error: any) {
            console.log("Error fetching data: " + error.message);
        }
    };
    const handleSelectAddress = (selectedAddress: any) => {
        const place_name = selectedAddress.place_name.split(",")

        if (place_name.length > 1) {
            let street = place_name[0];
            let city = place_name[1].split(" ").length > 3 ? place_name[1].split(" ")[2] + " " + place_name[1].split(" ")[3] : place_name[1].split(" ")[2] ? place_name[1].split(" ")[2] : "";
            let pincode = place_name[1].split(" ")[1] ? place_name[1].split(" ")[1]: "";
            let country = place_name[2] ? place_name[2]: ""

            handleAddress({number: "", street: street, pincode: pincode, city: city, country : "FR", state: ""})
        }

        setSuggestions && setSuggestions(null)
        handleTyping()
    };

    return (
       <div className="input-location-wrapper">
                   <Input data={{
                       type: "text",
                       name: field.name,
                       id: field.id,
                       value: selectedAddress ? selectedAddress : formData ? formData : "",
                       placeholder: field.placeholder,
                       ref: inputRef,
                   }}
                          handleChange={(e) => handleInputAddressChange(e, field.rules)}
                   />
                   {suggestions && typing && (
                       <div className={`address ${styleClass ? styleClass: ""}`}>
                           <div className="items">
                               {suggestions.map((item: any, index: number) => (
                                   <div className="item" onClick={() => handleSelectAddress(item)} key={index}>{item.place_name}</div>
                               ))}
                           </div>
                       </div>
                   )}
       </div>
    )
};

export default InputLocation;