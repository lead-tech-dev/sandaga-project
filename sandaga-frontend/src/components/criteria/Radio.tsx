import React, {FunctionComponent, MouseEvent } from "react";

interface RadioProps {
  name: string;
  value: string;
  label: string;
  selected: string;
  headLabel?: string;
  description?: string;
  handleRadioClick: (e: MouseEvent<HTMLInputElement>) => void;
  key?: number;
  className?: string;
}
const Radio: FunctionComponent<RadioProps> = ({
  name,
  value,
  label,
  selected,
  description,
  handleRadioClick,
  key,
  className,
}) => {
  const onclick = (e: MouseEvent<HTMLInputElement>) => {
    handleRadioClick(e);
  };

  return (
    <div className={`radio-box ${className}`} key={key}>
      <div className="radio-inner">
        <input
          type="radio"
          name={name}
          value={value}
          checked={selected === value}
          onClick={(e) => onclick(e)}
        />
        <span>{label}</span>
      </div>
      {description && <span className="description">{description}</span>}
    </div>
  );
};

export default Radio;
