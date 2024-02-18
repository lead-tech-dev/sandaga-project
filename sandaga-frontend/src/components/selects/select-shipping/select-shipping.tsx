import React, {
    ReactNode,
    FunctionComponent,
    useEffect,
    useRef,
    useState,
} from "react";
import "./select-shipping.style.scss"
import Spinner from "../../../assets/icons/Spinner";

export interface SelectOption {
    label: string;
    value: string;
    display?: boolean;
}

interface RenderOptionProps {
    isSelected: boolean;
    option: SelectOption;
    getOptionRecommendedProps: (overrideProps?: Object) => Object;
}

interface SelectProps {
    onOptionSelected?: (
        e: any,
        option: SelectOption,
        optionIndex: number,
    ) => void;
    options?: SelectOption[];
    label?: string;
    renderOption?: (props: RenderOptionProps) => ReactNode;
    customStyle?: string;
    disabled: boolean;
    data: string | null,
    loading?: boolean | null,
    error?: boolean
}

const SelectShipping: FunctionComponent<SelectProps> = ({
    error,
    loading,
    disabled,
                                                    options = [],
                                                    label = "Selectionner une option ...",
                                                    onOptionSelected: handler,
                                                    renderOption,
                                                    customStyle,
    data
                                                }) => {
    const [isOpen, setIsOpen] = useState<Boolean>(false);
    const labelRef = useRef<HTMLButtonElement>(null);
    const [overlayTop, setOverlayTop] = useState<number>(0);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const onOptionSelected = (
        e: any,
        option: SelectOption,
        optionIndex: number
    ) => {
        handler && handler(e, option, optionIndex);

        setSelectedIndex(optionIndex)

        setIsOpen(false);

        e.stopPropagation();
    };

    const onLabelClick = (e: any) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (error) {
           setSelectedIndex(null)
        }
    }, [error]);

    useEffect(() => {
        setOverlayTop((labelRef.current?.offsetHeight || 0) + 5);
    }, [labelRef.current?.offsetHeight]);


    let selectedOption = null;
    if (selectedIndex !== null) selectedOption = options[selectedIndex];


    return (
        <div className={`select-shipping ${customStyle ? customStyle : ""}`}>
            <button
                style={{pointerEvents: disabled ? "none" : "painted"}}
                ref={labelRef}
                className="select-shipping__label"
                onClick={(e) => onLabelClick(e)}
            >
        <span>
            {selectedOption !== null ? selectedOption.label : data !== null ? data : label}
        </span>
                {loading ? (
                    <Spinner/>
                ): (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`select-shipping__caret h-6 w-6 ${
                            isOpen ? "select-shipping__caret--open" : "select-shipping__caret--closed"
                        }`}
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
                )}
            </button>
            {isOpen && (
                <ul style={{ top: overlayTop }} className="select-shipping__overlay">
                    {options.filter(option => option.display !== true).map((option, optionIndex) => {
                        const isSelected = selectedIndex === optionIndex;

                        const renderOptionProps: RenderOptionProps = {
                            option,
                            isSelected,
                            getOptionRecommendedProps: (overrideProps = {}) => {
                                return {
                                    className: `select-shipping__option ${
                                        isSelected && "select-shipping__option--selected"
                                    }`,
                                    key: option.value,
                                    onClick: (e: any) =>
                                        onOptionSelected(e, option, optionIndex),
                                    ...overrideProps,
                                };
                            },
                        };
                        if (renderOption) return renderOption(renderOptionProps);
                        return (
                            <li
                                className={`select-shipping__option  ${
                                    option.value.length === 0 &&
                                    isSelected &&
                                    "select-shipping__option--selected"
                                }`}
                                onClick={(e) => onOptionSelected(e, option, optionIndex)}
                                key={optionIndex}
                            >
                              <span className="right">
                                  {option.label}
                              </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default SelectShipping;