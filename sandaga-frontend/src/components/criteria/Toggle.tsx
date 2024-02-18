import React, { FunctionComponent, useEffect, useState } from "react";

// Fields Props
interface FieldProps {
  name: string;
  label: string;
  values?: {
    value: string;
    label: string;
  }[];
  rules?: {
    err_regexp?: string;
    err_mandatory?: string;
    mandatory?: boolean;
    regexp?: string;
    max_length?: number;
  };
  unit?: string;
  default_checked?: boolean;
}

interface AnnonceProps {
  [key: string]: any;
}

interface ToggleProps {
  field: FieldProps;
  className?: string;
  annonceData: AnnonceProps;
  handleChecked: (option: { name: string; label: string; value: any }) => void;
  handleRemoveData?: (label: string) => void;
  handleError?: (label: string, value: boolean) => void;
}

const Toggle: FunctionComponent<ToggleProps> = ({
  field,
  className,
  annonceData,
  handleChecked,
  handleRemoveData,
  handleError,
}) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (Object.keys(annonceData).length === 0) {
      field.default_checked && setChecked(field.default_checked);

      field.default_checked &&
        handleChecked({
          name: field.name,
          label: field.label,
          value: field.default_checked,
        });
    } else {
      setChecked(annonceData[field.label]);
    }
  }, []);

  const handleChange = (e: any) => {
    setChecked((checked) => !checked);

    handleChecked({
      name: field.name,
      label: field.label,
      value: !checked,
    });

    if (field.label === "Je fais un don" && checked === true) {
      handleError && handleError("Votre prix de vente", true);
    } else {
      handleError && handleError("Votre prix de vente", false);
      handleRemoveData && handleRemoveData("Votre prix de vente");
    }
  };

  return (
    <div className={`${className}`}>
      <div className="toggle">
        <div className="toggle-switch">
          <input
            type="checkbox"
            className="checkbox"
            name={field.label}
            id={field.label}
            value={annonceData[field.label]}
            onClick={handleChange}
            checked={checked}
          />
          <label className="label" htmlFor={field.label}>
            <span className="inner" />
            <span className="switch" />
          </label>
        </div>
        {field.label}
      </div>
    </div>
  );
};

export default Toggle;
