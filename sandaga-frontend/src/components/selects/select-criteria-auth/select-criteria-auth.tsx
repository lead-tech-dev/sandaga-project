import React, {
    FunctionComponent,
    useEffect,
    useState,
    MouseEvent, memo,
} from "react";
import SearchIcon from "../../../assets/icons/SearchIcon";
import Button from "../../Button";
import ArrowRight from "../../../assets/icons/ArrowRight";
import Close from "../../../assets/icons/Close";
import {
    AdInterface,
    AdsInterface,
    FieldsInterface,
    RulesInterface,
} from "../../../interfaces/ads.interface";
import "./select-criteria-auth.style.scss"

interface SelectOption {
    name: string;
    value: string;
    label: string;
}

interface SelectOptionTest {
    value: string;
    label: string;
}

interface SelectCriteriaAuthProps {
    onOptionSelected: (option: SelectOption) => void;
    handleRemoveData: (label: string, name: string, mandatory: boolean) => void;
    className?: string;
    field: FieldsInterface;
    adsData: AdInterface;
    rules: RulesInterface | null;
}

const SelectCriteriaAuth: FunctionComponent<SelectCriteriaAuthProps> = ({
                                                    onOptionSelected,
                                                    handleRemoveData,
                                                    field,
                                                    adsData,
                                                }) => {
    const [showOptions, setShowOptions] = useState<boolean>(true);
    const [filteredOptions, setFilteredOptions] = useState<
        SelectOptionTest[] | null
    >(null);
    const [activeOption, setActiveOption] = useState<number>(0);
    const [userInput, setUserInput] = useState<string>("« Choisissez »");
    const [userTaping, setUserTaping] = useState<string>("");
    const [userData, setUserData] = useState<string>("");
    const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
    const [showInputSearch, setShowInputSearch] = useState<boolean>(false);
    const [rules, setRules] = useState<RulesInterface | null>(null);
    const [prevProps, setPrevProps] = useState<string>("");


    useEffect(() => {

        if (prevProps !== '' && prevProps !== adsData[field.depends_on as keyof AdsInterface]) {
            handleRemoveData(field.label, field.name, false);
        }

        if (field.depends_on && adsData[field.depends_on as keyof AdsInterface] !== undefined) {
            setPrevProps(adsData[field.depends_on as keyof AdsInterface])
            if (field.conditional_values){
                let values = [
                    ...field.conditional_values[
                        adsData[field.depends_on]
                            .split(" ").join("")
                            .toLowerCase()
                            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                        ]
                ];
                setFilteredOptions(values)
                field.values = values;
            }
        }else if (field.depends_on){
            field.values = [];
            handleRemoveData(field.label, field.name, false);
        }


        if (field.grouped_values) {
            let values = [] as any;
            field.grouped_values?.forEach(item => {
                values = [...values, ...item.values];
            })
            setFilteredOptions([...values]);
            field.values = values;
        }else  {
            field.values && setFilteredOptions(field.values);
        }

        field.rules && setRules(field.rules);
    }, [adsData[field.depends_on as keyof AdsInterface], adsData[field.name]]);

    const onChange = (e: any) => {
        const userTaping = e.currentTarget.value;

        const filteredOptions =
            field.values &&
            field.values.filter(
                (option) =>
                    option.label.toLowerCase().indexOf(userTaping.toLowerCase()) > -1,
            );

        setActiveOption(0);
        filteredOptions && setFilteredOptions(filteredOptions);
        setShowOptions(true);
        setUserTaping(userTaping);
    };

    const onClick = (e: any, label: string, name: string) => {
        e.persist();

        if (e.target.localName !== "svg") {
            setShowInputSearch(true);
        } else {
            let mandatory = field.rules?.mandatory ? field.rules.mandatory : false;

            handleRemoveData(label, name, mandatory);
            setUserInput("« Choisissez »");
        }
    };

    const onBlur = (event: any) => {
        event.preventDefault();
        setTimeout(() => {
            setShowInputSearch(false);
        }, 300);
    };

    const handleSelectedOption = (
        e: MouseEvent<HTMLDivElement>,
        option: SelectOption,
    ) => {
        e.persist();

        onOptionSelected({
            name: option.name,
            label: option.label,
            value: option.value[0].toUpperCase() + option.value.substring(1).toLowerCase(),
        });

        setUserInput(option.value);
    };

    let optionList;

    if (showOptions && filteredOptions) {
        if (filteredOptions.length) {
            optionList = (
                <ul className="options">
                    {filteredOptions.map((optionName, index) => {
                        let className;
                        if (index === activeOption) {
                            className = "option-active";
                        }
                        return (
                            <li className={className} key={index}>
                                <div
                                    className="form-group"
                                    onClick={(e) =>
                                        handleSelectedOption(e, {
                                            name: field.name,
                                            value: optionName.value,
                                            label: optionName.label,
                                        })
                                    }
                                >
                                    <div className="radio-box" key={index}>
                                        <div className="radio-inner">
                                            <input
                                                type="radio"
                                                name={field.name}
                                                value={optionName.label}
                                                checked={adsData[field.name] === optionName.label}
                                                onChange={() => console.log("")}
                                            />
                                            <span>{optionName.label}</span>
                                        </div>
                                        {/*{description && <span className="description">{description}</span>} */}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            );
        } else {
            optionList = (
                <div className="no-options">
                    <em>No Option!</em>
                </div>
            );
        }
    }


    return (
        <div className="col-12 col-md-6 mb-4 mt-2">
            <label className="">{field.label}</label>
            <div className="select-criteria-auth">
                {rules?.mandatory && <span className="required">Champ requis</span>}
                <div className={`select-criteria-auth__result-box ${!showInputSearch && "hide"}`}>
                    <div className="result-box-inner">
                        <div className="form-group">
                            <div className="input-box">
                                <SearchIcon />
                                <input
                                    type="text"
                                    name="search"
                                    className="show-search place"
                                    onChange={(event) => onChange(event)}
                                    value={userTaping}
                                    placeholder="Rechercher"
                                    onBlur={onBlur}
                                    ref={(input) => {
                                        input &&
                                        window.requestAnimationFrame(() => {
                                            input.focus();
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="list-box">{optionList}</div>
                </div>
                <div className="select-criteria-auth__search-box">
                    <Button
                        type="button"
                        className="show-result"
                        label={adsData[field.name] ? adsData[field.name] : "« Choisissez »"}
                        onClick={(e) => onClick(e, field.label, field.name)}
                        iconRight={
                            adsData[field.name] ? (
                                <Close
                                    onClick={(e) => onClick(e, field.label, field.name)}
                                    className="close"
                                />
                            ) : (
                                <ArrowRight />
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default memo(SelectCriteriaAuth);
