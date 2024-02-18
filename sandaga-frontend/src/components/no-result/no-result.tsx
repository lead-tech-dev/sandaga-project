import React, {FunctionComponent} from 'react';
import "./no-result.style.scss"
import Button from "../Button";
import NoResultSvg from './no-result.svg';
import {Link, useNavigate} from "react-router-dom";
interface NoResultProps {
    text?: string;
    msg: string;
    link: string;
    icon?: string;
    imgClassName?: string;
}
const NoResult: FunctionComponent<NoResultProps> = ({icon, text, msg,link, imgClassName}) => {
    const navigate = useNavigate();
    const onClickButton = () => {
        navigate(`${link}`, {replace: true})
    }

    console.log(imgClassName);
    return (
        <div className="no-result-wrapper">
            <h3>{text ? text : "Désolé, aucun résultat trouvé:("}</h3>
            <div className={`image-wrapper  ${imgClassName ? imgClassName: ""}`}>
                {icon ?  <span className="icon"><i className={`fa fa-${icon}`}  aria-hidden="true"/></span>  : <img  src={NoResultSvg} alt="No Result" />}
            </div>
            <div className="button-wrapper">
                <div onClick={onClickButton}>
                    <Link to={process.env.PUBLIC_URL + "/"} className="error-btn">
                        {msg}
                    </Link>
                </div>
            </div>
        </div>
    )
};

export default NoResult;