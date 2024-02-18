import React, {
    Fragment,
    FunctionComponent,
    useState,
    useEffect,
} from "react";
import Button from "../../Button";
import ArrowRight from "../../../assets/icons/ArrowRight";
import ArrowDown from "../../../assets/icons/ArrowDown";
import {
    CategoryInterface,
    SubCategoryInterface,
} from "../../../interfaces/ads.interface";
import "./select-category.style.scss";

interface SelectCategoriesProps {
    onOptionSelected: (
        category: CategoryInterface,
        option: SubCategoryInterface,
    ) => void;
    options: CategoryInterface[];
    subCategory?: SubCategoryInterface | null;
    category?: CategoryInterface | null;
    onHandleAdType: () => void;
    annonceData?: { [key: string]: any };
}

const SelectCategories: FunctionComponent<SelectCategoriesProps> = ({
                                                                        options,
                                                                        onOptionSelected,
                                                                        category,
                                                                        onHandleAdType,
                                                                        annonceData,
                                                                    }) => {
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [activeCategories, setActiveCategories] =
        useState<CategoryInterface | null>(null);
    const [categories, setCategories] = useState<CategoryInterface[]>(options);
    const [categoryLabel, setCategoryLabel] = useState<string>("Choisissez");
    const [selectedSubCategory, setSelectedSubCategory] =
        useState<SubCategoryInterface | null>(null);

    useEffect(() => {
        category
            ? setActiveCategories(category)
            : setActiveCategories(categories[0]);
    }, []);

    const handleClick = () => {
        setShowCategories(true);
        onHandleAdType();
    };

    const handleCategory = (option: CategoryInterface) => {
        setActiveCategories(option);
    };

    const handleOptionSelected = (
        category: CategoryInterface,
        subCategory: SubCategoryInterface,
    ) => {
        onOptionSelected(category, subCategory);

        setShowCategories(false);
        setCategoryLabel(subCategory.label);
        setSelectedSubCategory(subCategory);
    };

    return (
        <div className="categories">
            {!showCategories && (
                <div className="categories__box">
                    <label>Categories</label>
                    <Button
                        type="button"
                        className="show-result"
                        label={
                            annonceData && Object.keys(annonceData).length > 0
                                ? annonceData.categoryLabel &&
                                annonceData.subCategoryLabel.toLowerCase()
                                : categoryLabel
                        }
                        onClick={() => handleClick()}
                        iconRight={<ArrowDown />}
                    />
                </div>
            )}
            {showCategories && (
                <div className="categories__result">
                    <ul className="categories__result__overlay">
                        {options?.map((option, index) => (
                            <li
                                className={`categories__result__overlay__option ${
                                    activeCategories && activeCategories.id === option.id
                                        ? "active"
                                        : ""
                                }`}
                                key={index}
                                onClick={() => handleCategory(option)}
                            >
                                <Fragment>
                                  <span className="right">
                                    <span className="img">
                                      <img src={option.img} aria-hidden="true" alt="" />
                                    </span>
                                      {option.label.toLowerCase()}
                                  </span>

                                 <span className="icon">
                                       <ArrowRight />
                                 </span>
                                </Fragment>
                            </li>
                        ))}
                    </ul>
                    <span className="categories__result__divider"></span>
                    {activeCategories && (
                        <ul className={`categories__result__overlay sub-level`}>
                            <li className="categories__result__overlay__option">
                                <span className="right">
                                  <span className="img">
                                    <img src={activeCategories.img} aria-hidden="true" alt="" />
                                  </span>
                                  <h5>{activeCategories.label.toLowerCase()}</h5>
                                </span>
                            </li>
                            {annonceData &&
                                activeCategories.subcategories.map((item, index) => (
                                    <li
                                        key={index}
                                        className={`categories__result__overlay__option ${
                                            annonceData?.subCategoryId === item.id
                                                ? "active no-border-left"
                                                : ""
                                        }`}
                                        onClick={() => handleOptionSelected(activeCategories, item)}
                                    >
                                        {item.label}
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectCategories;
