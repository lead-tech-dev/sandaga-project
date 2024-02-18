import React, { FunctionComponent, useEffect } from "react";
import Radio from "./Radio";

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

interface OptionProps {
  name: string;
  label: string;
  value: string;
}

interface AnnonceProps {
  [key: string]: string;
}

interface RadiosProps {
  field: FieldProps;
  className?: string;
  handleRadio: (option: OptionProps) => void;
  annonceData: AnnonceProps;
}

const Radios: FunctionComponent<RadiosProps> = ({
  field,
  className,
  handleRadio,
  annonceData,
}) => {
  useEffect(() => {
    console.log(field);
    Object.keys(annonceData).length === 0 &&
      field.values &&
      handleRadio({
        name: field.name,
        label: field.label,
        value: field.values[0].label,
      });
  }, []);
  const handleRadioSelected = (option: OptionProps) => {
    handleRadio(option);
  };

  return (
    <div className="">
      <div className="form-group ">
        <label>{field.label}</label>
        {field.values &&
          field.values.map((item, index) => (
            <Radio
              name={field.name}
              label={item.label}
              value={item.label}
              selected={annonceData[field.label]}
              headLabel="Type d'annonce"
              className={className}
              handleRadioClick={(e) =>
                handleRadioSelected({
                  name: field.name,
                  label: field.label,
                  value: item.label,
                })
              }
              key={index}
            />
          ))}
      </div>
    </div>
  );
};

export default Radios;
