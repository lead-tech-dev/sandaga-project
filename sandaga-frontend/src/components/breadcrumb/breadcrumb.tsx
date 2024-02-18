import React from "react";
import { NavLink } from "react-router-dom";
import { Breadcrumbs } from "react-breadcrumbs-dynamic";
import "./breadcrumb.style.scss"

const Breadcrumb = () => {
    return (
        <div className="breadcrumb-area pt-35 pb-35 bg-gray-3">

                <div className="breadcrumb-content">
                    <Breadcrumbs
                        separator={<span>/</span>}
                        item={NavLink}
                        finalItem={"span"}
                    />
                </div>

        </div>
    );
};

export default Breadcrumb;
