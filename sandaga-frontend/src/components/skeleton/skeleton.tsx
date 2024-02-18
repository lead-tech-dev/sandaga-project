import React from 'react';
import "./skeleton.style.scss"

const SkeletonOne = ({}) => {
    return (
        <div className="col-6 col-md-4 col-lg-3 mb-5">
            <div className="wrapper">
                <div className="wrapper__image-wrapper image-wrapper__img">
                  <img className="skeleton"  alt="" />
                </div>
                <div className="wrapper__info-wrapper">
                    <h3 className="paymentLeft-wrapper__info">
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                    </h3>
                </div>
            </div>

        </div>
    )
};

export default SkeletonOne;