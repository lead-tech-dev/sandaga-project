import React, {
  Fragment,
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
  ChangeEvent,
} from "react";
import { definitionData } from "../../data/data";
import Toggle from "./Toggle";
import Input from "./Input";
import Textarea from "./Textarea";
import Radios from "./Radios";
import PriceReco from "./PriceReco";
import ShippingType from "./ShippingType";
import ShippingCost from "./ShippingCost";
import Info from "./Info";
import {
  AdInterface,
  DefinitionInterface,
  FieldRefInterface,
  FieldsInterface,
  RulesInterface,
} from "../../interfaces/ads.interface";
import SelectCriteriaAuth from "../selects/select-criteria-auth/select-criteria-auth";

interface CriteriaFilterProps {
  name: string;
  field: FieldsInterface;
  ref: FieldRefInterface | null;
  handleResult: (option: {
    name: string;
    label: string;
    value: string;
  }) => void;
  handleError?: (errMsg: string, isError: boolean) => void;
  handleRemoveData?: (label: string) => void;
  adsState: AdInterface;
  key: number
}

// Result Props
interface ResultProps {
  name: string;
  label: string;
  value: string;
}

const CriteriaFilter: FunctionComponent<CriteriaFilterProps> = ({
  name,
  field,
  ref,
  handleResult,
  handleError,
  adsState,
  handleRemoveData,
    key
}) => {
  const [definition, setDefinition] =
    useState<DefinitionInterface>(definitionData);
  const [result, setResult] = useState<ResultProps[] | null>(null);
  const [render, setRender] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [rules, setRules] = useState<RulesInterface | null>(null);
  const [errRegexp, setErrRegexp] = useState<string>("");
  const [errMandatory, setErrMandatory] = useState<string | null>(null);
  const [free, setFree] = useState<boolean>(false);

  useEffect(() => {
    let currentResult = {} as ResultProps;
    let arraResult = [] as ResultProps[];


    field.values?.forEach((item, index) => {
      currentResult = {
        name: field.label,
        label: item.label,
        value: item.value,
      };
      arraResult.push(currentResult);
    });

    field.rules && setRules(field.rules);

    setResult(arraResult);

    if (!field.rules?.mandatory && !field.rules?.regexp) {
      handleError && handleError(field.label, false);
    }
    handleError && handleError("price_reco", false);
    handleError && handleError("Coûts de livraison", false);
    handleError && handleError("Téléphone", false);
    handleError && handleError("Email", false);

    if (adsState["donation"] === true) {
      handleRemoveData && handleRemoveData("price_cents");
    } else {
      handleRemoveData && handleRemoveData("donation");
    }


    setFree(adsState["donation"]);
  }, [adsState["donation"]]);

  const handleCreteria = (option: ResultProps | null) => {
    option &&
      handleResult({
        name: option.name,
        label: field.name,
        value: option.label,
      });
    handleError && handleError(field.label, false);
  };

  const getFieldDefintion = (
    fieldName: string,
  ): {
    type: string;
    is_attribute: boolean;
    is_extended: boolean;
  } => {
    let filedType: {
      type: string;
      is_attribute: boolean;
      is_extended: boolean;
    } = { type: "", is_attribute: false, is_extended: false };

    Object.keys(definition).forEach((def) => {
      if (def === fieldName) {
        filedType.type = definition[def].type;
        filedType.is_attribute = definition[def].is_attribute;
        filedType.is_extended = definition[def].is_extended;
      }
    });

    return filedType;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    rules: RulesInterface | null,
  ) => {
    const value = e.currentTarget.value;
    const regex = rules?.regexp && new RegExp(rules?.regexp);

    if (regex && regex.test(value)) {
      setErrRegexp("");
      //setValue(value);
      handleResult({
        name: field.name,
        label: field.label,
        value: value,
      });

      handleError && handleError(field.label, false);
    } else {
      rules?.err_regexp && setErrRegexp(rules.err_regexp);
      //setValue(e.currentTarget.value);
      handleResult({
        name: field.name,
        label: field.label,
        value: value,
      });
      handleError && rules?.err_regexp && handleError(field.label, true);
    }
  };

  const handleBlur = (e: any) => {
    if (value === "") {
      rules?.err_mandatory && setErrRegexp(rules.err_mandatory);
      setValue(e.currentTarget.value);
    }
  };

  const handleCriteriaRemoveData = (
    label: string,
    name: string,
    mandatory: boolean,
  ) => {
    handleRemoveData && handleRemoveData(name);
    mandatory && handleError && handleError(label, true);
  };
//console.log(localField)

  let renderNode: ReactNode;
  let fieldDefinition = getFieldDefintion(field.name);

  switch (true) {
    case fieldDefinition.type === "select":
      renderNode = result ? (

          <SelectCriteriaAuth
              onOptionSelected={(option) => handleCreteria(option)}
              adsData={adsState}
              field={field}
              className="col-12 col-md-6 mb-4 mt-2"
              rules={rules}
              handleRemoveData={(label, name, mandatory) =>
                  handleCriteriaRemoveData(label, name, mandatory)
              }
          />

      ) : null;
      break;
    case fieldDefinition.type === "text" &&
      fieldDefinition.is_attribute === false:
      renderNode = (
        <Textarea
          field={field}
          className="col-12"
          errRegexp={errRegexp}
          errMandatory={errMandatory}
          handleChange={(event) => handleInputChange(event, rules)}
          onBlur={(e) => handleBlur(e)}
          value={adsState[field.name]}
        />
      );
      break;
    case fieldDefinition.type === "text" &&
      fieldDefinition.is_attribute === true:
      renderNode = (
        <Input
          data={{
            label: field.label,
            name: field.name,
            type: "text",
            ref: ref && ref[field.label],
            pattern: "[a-z]{1,15}",
            //maxLength: 2,
            symbol: field.unit,
            errRegexp: errRegexp,
            errMandatory: errMandatory,
            value: adsState[field.name],
            //icon: <SearchIcon />,
            //placeholder: "Que recherchez-vous ?",
            required: rules?.mandatory,
            readOnly: adsState["donation"],
          }}
          className="col-12 col-md-6"
          handleChange={(event) => handleInputChange(event, rules)}
          onBlur={(e) => handleBlur(e)}
        />
      );
      break;
    case fieldDefinition.type === "toggle":
      renderNode = (
        <Toggle
          field={field}
          handleChecked={(option) => handleResult(option)}
          handleError={(label, value) =>
            handleError && handleError(label, value)
          }
          annonceData={adsState}
          className="col-12"
        />
      );
      break;
    case fieldDefinition.type === "string":
      renderNode = (
        <Input
          data={{
            label: field.label,
            name: field.name,
            type: "text",
            ref: ref && ref[field.label],
            pattern: rules?.regexp,
            //maxLength: 2,
            //symbol: "pièce(s)",
            errRegexp: errRegexp,
            errMandatory: errMandatory,
            value: adsState[field.name],
            //icon: <SearchIcon />,
            //placeholder: "Que recherchez-vous ?",
            required: rules?.mandatory,
            readOnly: adsState["donation"],
          }}
          className="col-12 col-md-6 mb-4"
          handleChange={(event) => handleInputChange(event, rules)}
          onBlur={(e) => handleBlur(e)}
        />
      );
      break;
    case fieldDefinition.type === "radio":
      renderNode = (
        <Radios
          field={field}
          handleRadio={(option) => handleResult(option)}
          className="mb-3"
          annonceData={adsState}
        />
      );
      break;
    case fieldDefinition.type === "select_toggle_values":
      renderNode = (
        <Toggle
          field={field}
          handleChecked={(option) => handleResult(option)}
          handleError={(label, value) =>
            handleError && handleError(label, value)
          }
          handleRemoveData={(label) =>
            handleRemoveData && handleRemoveData(label)
          }
          annonceData={adsState}
          className="col-12"
        />
      );
      break;
    case fieldDefinition.type === "phone":
      renderNode = (
        <Input
          data={{
            label: field.label,
            name: field.name,
            type: "number",
            ref: ref && ref[field.label],
            pattern: rules?.regexp,
            maxLength: rules?.max_length,
            symbol: field.unit,
            errRegexp: errRegexp,
            errMandatory: errMandatory,
            value: adsState[field.name],
            //icon: <SearchIcon />,
            //placeholder: "Que recherchez-vous ?",
            required: rules?.mandatory,
            readOnly: adsState["donation"],
          }}
          className="col-12 col-md-6"
          handleChange={(event) => handleInputChange(event, rules)}
          onBlur={(e) => handleBlur(e)}
        />
      );
      break;
    case fieldDefinition.type === "select_cells":
      renderNode = result ? (
        <SelectCriteriaAuth
          onOptionSelected={(option) => handleCreteria(option)}
          adsData={adsState}
          field={field}
          className="col-12 col-md-6 mb-4 mt-2"
          rules={rules}
          handleRemoveData={(label) =>
            handleRemoveData && handleRemoveData(label)
          }
        />
      ) : null;
      break;
    case fieldDefinition.type === "hidden":
      renderNode = <span>{field.label}(Hidden)</span>;
      break;
    case fieldDefinition.type === "helper_vehicle_price_reco":
      renderNode = <span>{field.label}(helper_vehicle_price_reco)</span>;
      break;
    case fieldDefinition.type === "radio_vehicle_is_eligible_p2p":
      renderNode = <span>{field.label}(radio_vehicle_is_eligible_p2p)</span>;
      break;
    case fieldDefinition.type === "vehicle_history_report":
      renderNode = <span>{field.label}(vehicle_history_report)</span>;
      break;
    case fieldDefinition.type === "integer":
      renderNode = (
        <Input
          data={{
            label: field.label,
            name: field.name,
            type: "text",
            ref: ref && ref[field.label],
            pattern: rules?.regexp,
            maxLength: rules?.max_length,
            symbol: field.unit,
            errRegexp: errRegexp,
            errMandatory: errMandatory,
            value: adsState[field.name],
            //icon: <SearchIcon />,
            //placeholder: "Que recherchez-vous ?",
            required: rules?.mandatory,
            readOnly: adsState["donation"],
          }}
          className="col-12 col-md-6"
          handleChange={(event) => console.log(event)}
          onBlur={(e) => handleBlur(e)}
        />
      );
      break;
    case fieldDefinition.type === "radio_shipping_type":
      renderNode = <ShippingType field={field} />;
      break;
    case fieldDefinition.type === "input_shipping_cost":
      renderNode = (
        <ShippingCost
          adsData={adsState}
          field={field}
          onOptionSelected={(option) => handleCreteria(option)}
        />
      );
      break;
    case fieldDefinition.type === "select_refurbished_item_condition":
      renderNode = (
        <span>{field.label}(select_refurbished_item_condition)</span>
      );
      break;
    case fieldDefinition.type === "helper_price_reco":
      renderNode = (
        <PriceReco field={field} annonceData={adsState["donation"]} />
      );
      break;
    case fieldDefinition.type === "select_icon":
      renderNode = <span>{field.label}(select_icon)</span>;
      break;
    case fieldDefinition.type === "price_cents":
      renderNode = (
        <Input
          data={{
            label: field.label,
            name: field.name,
            type: "text",
            pattern: rules?.regexp,
            ref: ref && ref[field.label],
            errMandatory: errMandatory,
            errRegexp: errRegexp,
            maxLength: rules?.max_length,
            symbol: field.unit,

            value: adsState[field.name],
            //icon: <SearchIcon />,
            //placeholder: "Que recherchez-vous ?",
            required: rules?.mandatory,
            readOnly: adsState["donation"],
          }}
          className="col-12 col-md-6"
          handleChange={(event) => handleInputChange(event, rules)}
          onBlur={(e) => handleBlur(e)}
        />
      );
      break;
    case fieldDefinition.type === "information_text":
      renderNode = <Info text={field.label} />;
      break;
    case fieldDefinition.type === "multi_select_outside_access":
      renderNode = <span>{field.label}(multi_select_outside_access)</span>;
      break;
    case fieldDefinition.type === "select_new_item_type":
      renderNode = <span>{field.label}(select_new_item_type)</span>;
      break;
    case fieldDefinition.type === "select_nb_parkings":
      renderNode = <span>{field.label}(select_nb_parkings)</span>;
      break;
    case fieldDefinition.type === "input_nb_floors_house":
      renderNode = <span>{field.label}(input_nb_floors_house)</span>;
      break;
    case fieldDefinition.type === "input_nb_floors_building":
      renderNode = <span>{field.label}(input_nb_floors_building)</span>;
      break;
    case fieldDefinition.type === "select_min_night_booking":
      renderNode = <span>{field.label}(select_min_night_booking)</span>;
      break;
    case fieldDefinition.type === "multi_select":
      renderNode = <span>{field.label}(multi_select)</span>;
      break;
    case fieldDefinition.type === "input_land_plot_surface":
      renderNode = <span>{field.label}(input_land_plot_surface)</span>;
      break;
    case fieldDefinition.type === "salary_information_text":
      renderNode = <span>{field.label}(salary_information_text)</span>;
      break;
    case fieldDefinition.type === "input_issuance_date":
      renderNode = <span>{field.label}(input_issuance_date)</span>;
      break;
    case fieldDefinition.type === "select_toggle_ges":
      renderNode = <span>{field.label}(select_toggle_ges)</span>;
      break;
    case fieldDefinition.type === "input_floor_number":
      renderNode = <span>{field.label}(input_floor_number)</span>;
      break;
    case fieldDefinition.type === "select_toggle_energy_rate":
      renderNode = <span>{field.label}(select_toggle_energy_rate)</span>;
      break;
    case fieldDefinition.type === "select_toggle_elevator":
      renderNode = <span>{field.label}(select_toggle_elevator)</span>;
      break;
    case fieldDefinition.type === "select_toggle_critair":
      renderNode = <span>{field.label}(select_toggle_critair)</span>;
      break;
    case fieldDefinition.type === "select_version":
      renderNode = <span>{field.label}(select_version)</span>;
      break;
    case fieldDefinition.type === "select_finition":
      renderNode = <span>{field.label}(select_finition)</span>;
      break;

    default:
      renderNode = "No options";
  }

  return <Fragment key={key}>{renderNode}</Fragment>;
};

export default CriteriaFilter;
