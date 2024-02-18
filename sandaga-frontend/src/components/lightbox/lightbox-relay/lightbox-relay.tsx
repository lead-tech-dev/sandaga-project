import React, {FunctionComponent, useEffect, useState} from 'react';
import Close from "../../../assets/icons/Close";
import IconNext from "../../../assets/icons/icon-next";
import IconPrevious from "../../../assets/icons/icon-previous";
import "../lightbox-relay/lightbox-relay.style.scss"
import Mapview from "../../marker/mapview";
import Button from "../../Button";
import {RelayResponseProps} from "../../../helpers/Buy";
import relay from "../../payment/relay";

interface LightboxRelayProps {
    items: RelayResponseProps[];
    handleLightBox: (e: any) => void;
    index: number;
    handleSelectedRelay: (e: any, relay: any) => void
}
const LightboxRelay: FunctionComponent<LightboxRelayProps> = ({handleSelectedRelay, index, items, handleLightBox}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
       if (index) {
           setCurrentIndex(index)
       }

    },[index])

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? items.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };
    const goToNext = () => {
        const isLastSlide = currentIndex === items.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    /*const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };*/

   /* const handleCurrent = (index: number) => {
        setCurrentIndex(index)
    };*/

    return (
        <div className="col-12">
            <div className="lightbox-relay">
                <div className="lightbox-content relay">
                    <div
                        className="lightbox-content__close"
                        onClick={(e) => handleLightBox(e)}
                    >
                        <Close onClick={(e) => console.log(e)} />
                    </div>

                    <div className="lightbox-content__relay">
                        <div className="description">

                            <div className="info">
                                <div className="header">
                                    <div className="lightbox-content__next" onClick={goToNext}>
                                        <IconNext />
                                    </div>
                                    <h1>{items[currentIndex].enseigne}</h1>
                                    <div className="lightbox-content__previous" onClick={goToPrevious}>
                                        <IconPrevious />
                                    </div>
                                    {items[currentIndex].information !== "" && <span>Ce lieu est un locker</span>}
                                </div>
                                <div className="hours">
                                    {Object.keys(items[currentIndex].hours).map((item, index) => (
                                        <div className="hour" key={index}>
                                            <p>{item}</p>
                                            <span className={`${!items[currentIndex].hours[item] ? "lock": ""}`}>{items[currentIndex].hours[item] ? items[currentIndex].hours[item]: "Fermé"}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="btn">
                                    <Button
                                        label="Choisir ce point relais"
                                        className="btn-primary full-height full-width"
                                        type="submit"
                                        onClick={(e) => handleSelectedRelay(e, items[currentIndex]) }
                                    />
                                </div>
                            </div>

                        </div>
                        <Mapview viewport={{
                            latitude: items[currentIndex].location.lat,
                            longitude: items[currentIndex].location.lng,
                            zoom: 13,
                        }} height={500}/>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default LightboxRelay;