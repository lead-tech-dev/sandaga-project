import React, {FunctionComponent, useState} from 'react';
import Close from "../../../assets/icons/Close";
import IconNext from "../../../assets/icons/icon-next";
import IconPrevious from "../../../assets/icons/icon-previous";
import "./lightbox-image.style.scss"
import {ADS_IMAGE_URL} from "../../../hooks/useConfig";

interface LightboxProps {
    images: {id: string, name: string, imageUrl: string }[]
    handleLightBox: () => void;

}
const LightboxImage: FunctionComponent<LightboxProps> = ({images, handleLightBox}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };
    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const handleCurrent = (index: number) => {
        setCurrentIndex(index)
    };

    return (
        <div className="col-12">
            <div className="lightbox-image">
                <div className="lightbox-content">
                    <div
                        className="lightbox-content__close"
                        onClick={() => handleLightBox()}
                    >
                        <Close onClick={(e) => console.log(e)} />
                    </div>

                    <div className="lightbox-content__next" onClick={goToNext}>
                        <IconNext />
                    </div>

                    <div className="lightbox-content__previous" onClick={goToPrevious}>
                        <IconPrevious />
                    </div>
                    <div className="lightbox-content__img">
                        <div className="lightbox-content__product-image-large">
                            <img src={ADS_IMAGE_URL + images[currentIndex].name} alt="img large" className="lightbox-img" />
                        </div>

                        <div
                            className="lightbox-content__product-image-small"
                        >
                            {images.map((item, index) => (
                                <div
                                    className="lightbox-content__image-single "
                                    key={index}
                                    onClick={() => handleCurrent(index)}
                                >
                                    <img
                                        src={ADS_IMAGE_URL + item.name}
                                        alt="img small"
                                        className={`img-small ${currentIndex === index ? "active" : ""} img-lightbox`}
                                    />
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default LightboxImage;