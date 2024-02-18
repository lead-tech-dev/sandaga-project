import React, {
    FunctionComponent,
    useEffect,
    useState,
    MouseEvent,
} from "react";
import SearchIcon from "../../../assets/icons/SearchIcon";
import { FieldsInterface } from "../../../interfaces/ads.interface";
import "./select-criteria.style.scss";

interface SelectOption {
    name: string;
    value: string;
    label: string;
}

interface SelectOptionTest {
    value: string;
    label: string;
}

interface SelectCriteriaProps {
    handleSelection: (option: SelectOption) => void;
    field: FieldsInterface;
    data: any
}

const SelectCriteria: FunctionComponent<SelectCriteriaProps> = ({
                                                    handleSelection,
                                                    data,
                                                    field,
                                                }) => {
    const [showOptions, setShowOptions] = useState<boolean>(true);
    const [filteredOptions, setFilteredOptions] = useState<
        SelectOptionTest[] | null
    >(null);
    const [activeOption, setActiveOption] = useState<number>(0);
    const [userInput, setUserInput] = useState<string>("Chercher une valeur");
    const [userTaping, setUserTaping] = useState<string>("");


    useEffect(() => {
        field.values && setFilteredOptions(field.values)
    }, []);
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


    const handleSelectedOption = (
        e: MouseEvent<HTMLDivElement>,
        option: SelectOption,
    ) => {
        e.persist();


        handleSelection({
            name: option.name,
            label: option.label,
            value: option.value,
        });

        setUserInput(option.value);
    };

    let optionList;

    if (showOptions && filteredOptions) {
        if (filteredOptions.length) {
            optionList = (
                <ul className="options height">
                    {filteredOptions.map((optionName, index) => {
                        //console.log(optionName.label)
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
                                            value: optionName.label,
                                            label: optionName.label,
                                        })
                                    }
                                >
                                    <div className="form-group">
                                        <div className="radio-box" key={index}>
                                            <div className="radio-inner">
                                                <input
                                                    type="radio"
                                                    name={field.name}
                                                    value={optionName.label}
                                                    checked={data ? data.filters.criteria[field.name] === optionName.label : false}
                                                    onChange={(event) => console.log(event)}
                                                />
                                                <span>{optionName.label}</span>
                                            </div>
                                        </div>

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
            <div className="select-criteria">
                <div className={`select-criteria__result-box`}>
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
                                    placeholder="Rechercher une valeur"
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
            </div>

    );
};

export default SelectCriteria;
