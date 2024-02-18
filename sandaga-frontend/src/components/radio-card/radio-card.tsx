import React, {FunctionComponent} from 'react';
import "./radio-card.style.scss";

interface RadioCardProps {

}
const RadioCard: FunctionComponent<RadioCardProps> = ({}) => {
    return (
        <div className="radio-container">
            <input className="radio-input" id="apples" type="radio" name="fruit" />
            <label className="radio" htmlFor="apples">Apples</label>
            <input className="radio-input" id="oranges" type="radio" name="fruit" />
            <label className="radio" htmlFor="oranges">Oranges</label>
        </div>
    );
};

export default RadioCard;

