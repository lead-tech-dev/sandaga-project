import React, {
  FunctionComponent,
  ChangeEvent,
  ReactElement,
  RefObject,
} from "react";

interface InputProps {
  data: {
    label?: string;
    name: string;
    type: string;
    id: string;
    inputClassName?: string;
    pattern?: string;
    maxLength?: number;
    minLength?: number;
    size?: number;
    symbol?: string;
    value: string | number;
    placeholder?: string;
    icon?: ReactElement;
    required?: boolean;
    errRegexp?: string | null;
    errMandatory?: string | null;
    readOnly?: boolean;
    ref: RefObject<HTMLInputElement>;
    radius?: string;
    min?: number;
    max?: number;
    step?: number;
    autoComplete?: string;
  };
  style?: any,
  className?: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: any) => void;
  autoFocus?: boolean
}

const Input: FunctionComponent<InputProps> = ({
  data: {
    label,
    name,
    type,
    id,
    pattern,
    maxLength,
    minLength,
    size,
    min,
    max,
      step,
    symbol,
    value,
    icon,
    placeholder,
    required,
    errRegexp,
    errMandatory,
    readOnly,
    ref,
    radius,
    autoComplete
  },
  className,
  handleChange,
  onBlur,
  autoFocus,
  style
}) => {


  return (
    <div className={`input-box ${readOnly ? "disabled" : ""}`}>
      {label && <label>{label}</label>}
      {radius && <span className="radius">{radius}</span>}
      {required && (
        <span className={`${errRegexp && "error"}`}>Champ requis</span>
      )}
      {icon && icon}
      <input
        style={style}
        type={type}
        name={name}
        id={id}
        className={`${className ? className : ""}  ${
          !readOnly && (errRegexp || errMandatory) ?  "error" : ""
        }  ${!icon ? "no-icon": ""}`}
        pattern={pattern}
        size={size}
        maxLength={maxLength}
        minLength={minLength}
        min={min}
        max={max}
        step={step}
        autoComplete={autoComplete}
        onChange={(event) => handleChange(event)}
        //value={pattern && pattern.test(value) === true ? value : ""}
        //value={readOnly ? "" : value}
        value={value}
        placeholder={placeholder}
        onBlur={onBlur}
        autoFocus={autoFocus}
        // ref={(input) => {
        //   onBlur &&
        //     input &&
        //     window.requestAnimationFrame(() => {
        //       input.focus();
        //     });
        // }}
        ref={ref}
        readOnly={readOnly}
        disabled={readOnly}
      />
      {!readOnly && symbol && <div className="symbol">{symbol}</div>}
      {!readOnly && errRegexp && <p className="error">{errRegexp}</p>}
      {!readOnly && errMandatory && <p className="error">{errMandatory}</p>}
    </div>
  );
};

export default Input;
