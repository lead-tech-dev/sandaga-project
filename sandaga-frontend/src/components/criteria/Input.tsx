import React, {
  FunctionComponent,
  ChangeEvent,
  ReactElement,
  LegacyRef,
} from "react";

interface InputProps {
  data: {
    label?: string;
    name: string;
    type: string;
    ref: LegacyRef<HTMLInputElement>
    inputClassName?: string;
    pattern?: string;
    maxLength?: number;
    symbol?: string;
    value: string;
    placeholder?: string;
    icon?: ReactElement;
    required?: boolean;
    errRegexp?: string;
    errMandatory?: string | null;
    readOnly?: boolean;
    disabled?: boolean
  };
  className?: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: any) => void;
}

const Input: FunctionComponent<InputProps> = ({
  data: {
    label,
    name,
    type,
    inputClassName,
    pattern,
    maxLength,
    symbol,
    value,
    icon,
    placeholder,
    required,
    errRegexp,
    errMandatory,
    readOnly,
    disabled,
    ref
  },
  className,
  handleChange,
  onBlur,
}) => {

  return (
    <div className={`${className}`}>
      <div className="form-group">
        <div className={`input-box ${readOnly && "disabled"}`}>
          {label && <label>{label}</label>}
          {required && <span>Champ requis</span>}
          {icon && icon}
          <input
            type={type}
            name={name}
            className={`${className} ${
              !readOnly && (errRegexp || errMandatory) && "error"
            } ${placeholder && "placeholder"}`}
            pattern={pattern}
            size={maxLength}
            maxLength={maxLength}
            onChange={(event) => handleChange(event)}
            //value={pattern && pattern.test(value) === true ? value : ""}
            value={readOnly ? "" : value}
            placeholder={placeholder}
            onBlur={onBlur}
            // ref={(input) => {
            //   onBlur &&
            //     input &&
            //     window.requestAnimationFrame(() => {
            //       input.focus();
            //     });
            // }}
            ref={ref}
            readOnly={readOnly}
            disabled={label === "Téléphone" || label === "Email" && true}
          />
          {!readOnly && symbol && <div className="symbol">{symbol}</div>}
          {!readOnly && errRegexp && <p className="error">{errRegexp}</p>}
          {!readOnly && errMandatory && <p className="error">{errMandatory}</p>}
        </div>
      </div>
    </div>
  );
};

export default Input;
