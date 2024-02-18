import React, {createRef, FunctionComponent, useState} from "react";
import SearchIcon from "../../assets/icons/SearchIcon";
import Input from "./Input";
import Checkbox from "./Checkbox";

interface SelectOption {
  value: string;
}

interface MultiSelectProps {
  options: string[];
  onOptionSelected: (option: SelectOption) => void;
  required: boolean;
}

const MultiSelect: FunctionComponent<MultiSelectProps> = ({
  options,
  onOptionSelected,
  required,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(true);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [activeOption, setActiveOption] = useState<number>(0);
  const [userInput, setUserInput] = useState<string[]>(["« Choisissez »"]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showInputSearch, setShowInputSearch] = useState<boolean>(false);

  const onChange = (e: any) => {
    const searchInput = e.currentTarget.value;
    const filteredOptions = options.filter(
      (option) => option.toLowerCase().indexOf(searchInput.toLowerCase()) > -1
    );

    setActiveOption(0);
    setFilteredOptions(filteredOptions);
    setShowOptions(true);
    setSearchInput(searchInput);
  };
  const onClick = (e: any) => {
    e.persist();
    let value;
    e.target.localName === "input" && (value = e.target.value);
    e.target.localName === "label" && (value = e.target.innerText);
    e.target.localName === "span" && (value = e.target.innerText);

    userInput.forEach((item, index) => {
      item === e.target.value ? removeItem(index) : addItem(e.target.value);
    });

    onOptionSelected(value);
  };

  const removeItem = (index: number) => {
    setUserInput(userInput.filter((item, i) => i !== index));
  };

  const addItem = (value: string) => {
    !userInput.includes(value) && setUserInput([...userInput, value]);
  };

  window.onclick = function (event: any) {
    event.preventDefault();
    console.log(event);
    if (
      event.target.classList[0] === "show-result" ||
      event.target.classList[0] === "show-search"
    ) {
      setShowInputSearch(true);
    } else {
      setShowInputSearch(false);
    }
  };

  let optionList;
  if (showOptions && showInputSearch) {
    if (filteredOptions.length) {
      optionList = (
        <ul className="options">
          {filteredOptions.map((optionName, index) => {
            let className;
            if (index === activeOption) {
              className = "option-active";
            }
            return (
              <li className={className} key={optionName}>
                <div className="form-group">
                  <label className="form-control">
                    <Checkbox
                      name={optionName}
                      value={optionName}
                      checkedData={userInput}
                      handleCheckbox={(event) => onClick(event)}
                    />
                    <span>{optionName}</span>
                  </label>
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
    <React.Fragment>
      <div className="search">
        {required && <span>Requis</span>}
        <div className={`result-box ${!showInputSearch && "hide"}`}>
          <div className="result-box-inner">
            <Input
              data={{
                name: "search",
                type: "text",
                value: searchInput,
                ref: createRef,
                icon: <SearchIcon />,
                inputClassName: "show-search",
                placeholder: "Rechercher",
                required: false,
              }}
              handleChange={(event) => onChange(event)}
            />
          </div>
          <div className="list-box">{optionList}</div>
        </div>
        <div className="search-box">
          <button className="show-result">
            {userInput.length === 1
              ? userInput.toString()
              : userInput.filter((item, index) => index !== 0).join(", ")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className=""
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="1rem"
              height="1rem"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MultiSelect;
