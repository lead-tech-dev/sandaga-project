import React, {
    ReactNode,
    FunctionComponent,
    useEffect,
    useRef,
    useState,
    Fragment,
    memo
} from "react";
import List from "../../../assets/icons/List";
import {CategoryInterface, SubCategoryInterface} from "../../../interfaces/ads.interface";
import Back from "../../../assets/icons/Back";

import "./select-search.style.scss"
import {useSearchParams} from "react-router-dom";
import {exitsCategory, getCategoryById, getSubCategoryById} from "../../../helpers/Poster";
import {categoriesData} from "../../../data/data";

//const areEqual = (prevProps: any, nextProps: any) => true;
/*interface SubSelectOption {
    label: string;
    value: string;
    productNumber: number;
    img: string;
}*/
interface RenderOptionProps {
    isSelected: boolean;
    option: CategoryInterface;
    getOptionRecommendedProps: (overrideProps?: Object) => Object;
}

interface SelectProps {
    selectedCategory?: SubCategoryInterface | null;
    onOptionSelected?: (
        option: {name: string; value: string},
        optionIndex: number,
        childOptionIndex: number | null
    ) => void;
    options?: CategoryInterface[];
    label?: string;
    renderOption?: (props: RenderOptionProps) => ReactNode;
    customStyle?: string;
    icon?: boolean;
    direction?: string;
}

const SelectSearch: FunctionComponent<SelectProps> = ({
                                                          options = [],
                                                          label = "Selectionner une categorie ...",
                                                          onOptionSelected: handler,
                                                          icon = false,
                                                      }) => {
    const [isOpen, setIsOpen] = useState<Boolean>(false);
    const labelRef = useRef<HTMLButtonElement>(null);
    const [overlayTop, setOverlayTop] = useState<number>(0);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [selectedSubcategoryOption, setSelectedSubcategoryOption] = useState<SubCategoryInterface | null>(null);
    const [selectedCategoryOption, setSelectedCategoryOption] = useState<CategoryInterface | null>(null);
    const [width, setWidth] = useState<number>(0)
    const [btnOpen, setBtnOpen] = useState<boolean>(false)
    const [optionOpen, setOptionOpen] = useState<boolean>(false)
    const [selectedCategoryMd, setSelectedCategoryMd] = useState<CategoryInterface | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryInterface | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryId = searchParams.get("category")

    useEffect(() => {
        if (categoryId) {
            let exits = exitsCategory(categoryId, categoriesData);

            if (exits.exist) {

                if (exits.type === "category") {

                    let cat =  getCategoryById(categoriesData, categoryId) as CategoryInterface;

                    if (cat) {
                        setSelectedCategoryOption(cat)
                        options.forEach((item, index) => {
                           if (item.id === cat.id) setSelectedIndex(index)
                        })
                    }
                }else {
                    let subCat =  getSubCategoryById(categoriesData, categoryId) ;

                       if(subCat && categoryId === subCat.subcategory.id) {
                           setSelectedSubcategoryOption(subCat.subcategory)
                          setSelectedCategoryOption(subCat.category)
                       }

                }
            }
        }else {
            setSelectedCategoryOption(null)
            setSelectedSubcategoryOption(null)
        }
    }, [categoryId])

    useEffect(() => {
        setWidth(window.innerWidth)
        const handleResize = () => {
            if (window.innerWidth > 767) {
                setBtnOpen(false)
                setOptionOpen(false)
            }
            setWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)

    }, [])

    const onOptionSelected = (
        e: any,
        option: SubCategoryInterface,
        optionIndex: number,
        childOptionIndex: number | null
    ) => {

        handler && handler( {name: "category", value: option.id}, 0, null);

        setIsOpen(false);
        setOptionOpen(false)
        setBtnOpen(false)

        e.stopPropagation();
    };

    const onLabelClick = (e: any) => {
        e.preventDefault();
        setIsOpen(!isOpen);

    };

    const handleBlur= (e: any) => {
        e.preventDefault();
        if(width > 766) {
            setTimeout(() => {
                setIsOpen(!isOpen);
            }, 300);
        }

    };

    useEffect(() => {
        setOverlayTop((labelRef.current?.offsetHeight || 0) + 5);
    }, [labelRef.current?.offsetHeight]);

    const handleBtnOpen = (e: any, option?: CategoryInterface, index?: number) => {
        e.preventDefault();

        setBtnOpen(!btnOpen)
        setOptionOpen(!optionOpen)
        index && setSelectedIndex(index)
        option && setSelectedCategoryMd(option)
    }

    return (
        <div className="select-search">
            {!btnOpen && (
                <button
                    ref={labelRef}
                    className="select-search__label"
                    onClick={(e) => onLabelClick(e)}
                    onBlur={(e) => handleBlur(e)}
                >
                <span>
                  {icon && <List />}
                    {!selectedSubcategoryOption && !selectedCategoryOption
                        ? label
                        : selectedCategoryOption && !selectedSubcategoryOption
                            ? selectedCategoryOption.label[0].toUpperCase() + selectedCategoryOption.label.substring(1).toLowerCase()
                            : selectedSubcategoryOption && selectedSubcategoryOption.label
                    }
                </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`select__caret ${
                            isOpen ? "select__caret--open" : "select__caret--closed"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        width="1.2rem"
                        height="1.2rem"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"

                        />
                    </svg>
                </button>
            )}
            {optionOpen && (
                (
                    <button
                        ref={labelRef}
                        className="select-search__label"
                        onClick={(e) => handleBtnOpen(e)}
                    >
                <span>
                  {icon && <Back />}
                    Retour
                </span>
                    </button>
                )
            )}
            {isOpen && (
                <Fragment>
                    {!btnOpen && (
                        <ul className={`select-search__overlay ${width < 767 ? "search-md" : ""}`}>
                            {options.map((option, optionIndex) => {
                                const isSelected = selectedCategoryOption?.id === option.id;

                                return (
                                    <li
                                        className={`select-search__option ${
                                            isSelected && "select-search__option--selected"
                                        } ${
                                            option.subcategories instanceof Array &&
                                            option.subcategories.length > 0 ?
                                            "with-sub-level" : ""
                                        } `}
                                        onClick={(e) => width < 767 && handleBtnOpen(e, option, optionIndex)}
                                        key={optionIndex}
                                    >
                              <span className="right">
                                <span className="img">
                                  <img src={option.img} aria-hidden="true" alt="" />
                                </span>

                                  {option.label[0].toUpperCase() + option.label.slice(1).toLowerCase()}
                              </span>

                                        <ul className="sub-level">
                                            {option.subcategories instanceof Array &&
                                                option.subcategories.map((option1, index) => (
                                                    <li
                                                        className={`select-search__option ${
                                                            option1.id === selectedSubcategoryOption?.id ?
                                                                "select-search__option--selected" : ""
                                                        }  `}
                                                        onClick={(e) =>
                                                            onOptionSelected(e, option1, optionIndex, index)
                                                        }
                                                        key={index}
                                                    >
                                                        {option1.label}
                                                        {/*<span>({option1.productNumber})</span>*/}
                                                    </li>
                                                ))}
                                        </ul>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    {width < 767  && optionOpen && selectedCategoryMd && (
                        <ul className="select-search__sub-level-md">
                            {
                                selectedCategoryMd.subcategories.map((option1, index) => (
                                    <li
                                        className={`select-search__option ${
                                            option1.id === selectedSubcategoryOption?.id ?
                                                "select-search__option--selected" : ""
                                        }  `}
                                        onClick={(e) =>
                                            selectedIndex && onOptionSelected(e, option1, selectedIndex, index)
                                        }
                                        key={index}
                                    >
                                        {option1.label}
                                        {/*<span>({option1.productNumber})</span>*/}
                                    </li>
                                ))}
                        </ul>
                    )}
                </Fragment>
            )}
        </div>
    );
};

export default memo(SelectSearch);
