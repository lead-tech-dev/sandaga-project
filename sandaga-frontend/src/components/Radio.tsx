import React, { ChangeEvent, FunctionComponent } from "react";
interface RadioProps {
  name: string;
  value: string;
  label: string;
  selected: string;
  headLabel?: string;
  description?: string;
  handleRadioClick: (e: ChangeEvent<HTMLInputElement>) => void;
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
  className,
}) => {
  const onclick = (e: ChangeEvent<HTMLInputElement>) => {
    handleRadioClick(e);
  };


  return (
    <div className={`radio-box ${className}`}>
      <div className="radio-inner">
        <input
          type="radio"
          name={name}
          value={value}
          checked={selected !== "" && value !== "" ? selected === value: false}
          onChange={(e) => onclick(e)}
        />
        <span>{label}</span>
      </div>
      {description && <span className="description">{description}</span>}
    </div>
  );
};

export default Radio;
