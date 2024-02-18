import React, { FunctionComponent } from "react";

/*
interface RulesProps {
  err_regexp?: string;
  err_mandatory?: string;
  mandatory?: boolean;
  regexp?: string;
  max_length?: number;
}
*/

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
}

interface ShippingTypeProps {
  field: FieldProps;
}

const ShippingType: FunctionComponent<ShippingTypeProps> = ({  }) => {
  // console.log(field);
  return (
    <div className="shipping">
      <label>
        Remise en main propre <span className="status">Activé</span>
      </label>
      <p>Vous acceptez de remettre l’article à votre acheteur en main propre</p>
    </div>
  );
};

export default ShippingType;
