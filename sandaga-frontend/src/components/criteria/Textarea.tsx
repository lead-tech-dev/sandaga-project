import React, {
  FunctionComponent,
  ChangeEvent,
  useState,
  useEffect,
  useRef,
} from "react";

interface RulesProps {
  err_regexp?: string;
  err_mandatory?: string;
  mandatory?: boolean;
  regexp?: string;
  max_length?: number;
}

// Fields Props
interface FieldProps {
  name: string;
  label?: string;
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

interface TextAreaProps {
  field: FieldProps;
  className?: string;
  errRegexp: string;
  errMandatory: string | null;
  handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: any) => void;
  value: string;
  placeholder?: string
}

const Textarea: FunctionComponent<TextAreaProps> = ({
  field,
  className,
  errRegexp,
  errMandatory,
  handleChange,
  onBlur,
  value,
                                                      placeholder
}) => {
  const [rules, setRules] = useState<RulesProps | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    field.rules && setRules(field.rules);
    //textAreaRef.current?.focus();
  }, []);

  return (
    <div className={`textarea-box ${className}`}>
      <div className="form-group">
        {field.label && <label>{field.label}</label>}
        {rules?.mandatory && (
          <span
            className={`texterea ${(errRegexp || errMandatory) && "error"}`}
          >
            Champ requis
          </span>
        )}
        <textarea
          name={field.name}
          rows={8}
          className={`${errRegexp && "error"}`}
          onChange={(event) => handleChange(event)}
          onBlur={onBlur}
          ref={textAreaRef}
          value={value}
          placeholder={placeholder ? placeholder: ""}
        />
        {errRegexp && <p className="error textarea">{errRegexp}</p>}
        {errMandatory && <p className="error textarea">{errMandatory}</p>}
      </div>
    </div>
  );
};

export default Textarea;
