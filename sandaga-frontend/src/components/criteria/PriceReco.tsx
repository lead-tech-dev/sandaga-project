import React, { FunctionComponent } from "react";


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

interface PriceRecoProps {
  field: FieldProps;
  className?: string;
  annonceData: boolean;
}

const PriceReco: FunctionComponent<PriceRecoProps> = ({
  className,
  annonceData,
}) => {
  return !annonceData ? (
    <div
      className={`${className}`}
      style={{
        color: `${annonceData ? "grey" : ""}`,
      }}
    >
      <div className="form-group ">
        <label className="mt-4">
          Prix recommandé entre <span style={{ color: "red" }}> 2 €</span> et{" "}
          <span style={{ color: "red" }}>19 €</span>
        </label>
      </div>
    </div>
  ) : null;
};

export default PriceReco;
