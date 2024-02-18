import React, { FunctionComponent, MouseEvent } from "react";
import Check from "../../assets/icons/Check";

interface CheckboxProps {
  name: string;
  value: string;
  className?: string;
  checkedData: string[];

  handleCheckbox: (event: MouseEvent<HTMLElement>) => void;
}
const Checkbox: FunctionComponent<CheckboxProps> = ({
  name,
  value,
  checkedData,
  className,
  handleCheckbox,
}) => {
  const isChecked = (value: string): boolean => {
    let checked: boolean = false;
    checkedData && checkedData.forEach((item) => {
      if (item === value) {
        checked = true;
      }
    });

    return checked;
  };

  return (
    <div className="checkbox">
      <input
        type="checkbox"
        name={name}
        value={value}
        className={className}
        onClick={(e) => handleCheckbox(e)}
        checked={isChecked(value)}
      />
      <Check />
    </div>
  );
};

export default Checkbox;
