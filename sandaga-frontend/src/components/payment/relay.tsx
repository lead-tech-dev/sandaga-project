import React, {Fragment, FunctionComponent, useEffect, useState} from 'react';
import Radio from "../Radio";
import {RelayResponseProps} from "../../helpers/Buy";

interface RelayProps {
    relay: RelayResponseProps;
    handleRadio?: (relay: RelayResponseProps) => void;
    data: RelayResponseProps | null;
    value: string
    handleLightBox: (e: any, index: number) => void;
    index: number;
}
const Relay: FunctionComponent<RelayProps> = ({index, handleLightBox, relay, handleRadio, data, value}) => {
const [selectedValue, setSelectedValue] = useState<string>("")

    useEffect(() => {
        if (relay) {
            setSelectedValue(relay.enseigne);
        }
    }, [relay]);

    return(
        <div className="item" key={index} >
                <div className="left">
                    <div className="radio">
                        <Radio name="relay" value={selectedValue} label="" selected={data?.enseigne ? data.enseigne : ""} handleRadioClick={handleRadio ?  (e) => {
                            handleRadio(relay)
                            setSelectedValue(relay.enseigne)

                        } : (e) => console.log(e)}/>
                    </div>
                    <div className="content">
                        <p className="name">{relay.enseigne.toLowerCase()}</p>
                        <p className="address">{relay.address.toLowerCase()}, {relay.cp} {relay.ville}</p>
                        <a href="@#" className="link" onClick={(e) => handleLightBox(e, index)}>Voir plus de détails</a>
                    </div>
                </div>
                <span className="distance">{Math.round(parseInt(relay.distance) / 100) / 10} km</span>
            </div>
    );
}

export default Relay;