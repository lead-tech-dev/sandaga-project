import React, {FunctionComponent, useRef} from "react";
import ArrowRight from "../assets/icons/ArrowRight";
import Button from "./Button";
import {FieldsInterface} from "../interfaces/ads.interface";
import Input from "./Input";
import SelectCriteria from "./selects/select-criteria/select-criteria";

interface FilterProps {
    category?: string
    criteria?: FieldsInterface;
    handleSearchKey: Function;
    openSubCat?: boolean;

    price?: {label: string; values: {title: string; name: string}[]};
    ad_type?: {label: string; name: string; values: {label: string; value: string}[]};
    sort?: {label: string; name: string; values: {label: string; value: string}[]}
    onOptionSelected: (
        option: {name: string; value: string, additional?: {name: string; value: string}}
    ) => void;

    onOptionDelete?: (name: string) => void;
    data?: any;
}

const Filter: FunctionComponent<FilterProps> = ({onOptionDelete, onOptionSelected, ad_type, sort, price, openSubCat, category, criteria, handleSearchKey, data }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleOnChange = (name: string, value: string) => {
        if (value !== "") {
            onOptionSelected({name: name, value: value})
        }else {
          onOptionDelete &&  onOptionDelete(name)
        }
    }
    return (
        <div className="filter-container">
            <div className="header">
                {/*{!openSubCat && data.icon && data.icon}*/}
                {!openSubCat && <span className="title">{criteria && criteria.label}</span>}
                {!openSubCat && category &&  <span className="title">{!criteria && "Categorie"}</span>}
                {!openSubCat && price &&  <span className="title">{!criteria && price.label}</span>}
                {!openSubCat && sort &&  <span className="title">{!criteria && sort.label}</span>}
                {!openSubCat && ad_type &&  <span className="title">{!criteria && ad_type.label}</span>}
                { criteria && criteria.values && criteria.values.length > 5 && !openSubCat && (
                    <div className="subtitle">
                        {criteria.values.slice(0, 4).map((item) => (
                            <span>{item.label}, </span>
                        ))}
                        ...
                    </div>
                )}
            </div>

            {!criteria &&(
                <div className="button">
                    <a role="button" className="btn-filter">
                        {category  && category[0].toUpperCase() + category.substring(1).toLowerCase()}
                    </a>
                </div>
            )}

            {(criteria && criteria.values && criteria.values.length === 1 || criteria && criteria.values && criteria.values.length > 5) && (
                <div className="button">
                    <a role="button" className="btn-filter">
                        {
                            !openSubCat && (
                                <Button
                                    label={data  && data.filters.criteria[criteria.name] ? data.filters.criteria[criteria.name] : "Tout"}
                                    className="btn-transparent-3 right border-none custom"
                                    onClick={() => handleSearchKey(criteria)}
                                    type="button"
                                    iconRight={<ArrowRight />}
                                    spanClassName={data  && data.filters.criteria[criteria.name] && "custom"}
                                />
                            )}
                    </a>
                </div>
            )}

            {price && (
                <div className="filter-form">
                    <form action="#" method="post" className="">
                       <div className="row">
                           {price.values.map((item, index) => (
                               <div className="col-12 col-md-6 col-lg-6" key={index}>
                                   <div className="form-group">
                                       <Input
                                           data={{
                                               type: "number",
                                               label: item.title,
                                               name: item.name,
                                               value: data && data.filters.ranges && Object.keys(data.filters.ranges.price).includes(item.name) ? data.filters.ranges.price[item.name] : "",
                                               ref: inputRef,
                                               id: item.name,
                                               symbol: "€"
                                           }}
                                           handleChange={(e) => handleOnChange(item.name, e.target.value)}

                                       />

                                   </div>
                               </div>
                           ))}
                       </div>
                    </form>
                </div>
            )}

            {sort && (
                <div className="filter-form">
                    <form action="#" method="post" className="">
                        <div className="row">
                            {sort.values.map((item, index) => (
                                <div className="col-12" key={index}>
                                    <div className="form-group">
                                        <div className="radio-box" key={index}>
                                            <div className="radio-inner">
                                                <input
                                                    type="radio"
                                                    name={sort?.name}
                                                    value={item.value}
                                                    checked={data ? data[sort?.name] + "_" + data["order"] === item.value : false}
                                                    onClick={(e) => onOptionSelected({name: sort?.name, value: item.value})}
                                                />
                                                <span>{item.label}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
            )}

            {ad_type && (
                <div className="filter-form">
                    <form action="#" method="post" className="">
                        <div className="row">
                            {ad_type.values.map((item, index) => (
                                <div className="col-12" key={index}>
                                    <div className="form-group">
                                        <div className="radio-box" key={index}>
                                            <div className="radio-inner">
                                                <input
                                                    type="radio"
                                                    name={ad_type?.name}
                                                    value={item.value}
                                                    checked={data ? data.filters.criteria[ad_type?.name] === item.value : false}
                                                    onChange={(e) => onOptionSelected({name: e.target.name, value: e.target.value})}
                                                />
                                                <span>{item.label}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
            )}

            {criteria && criteria.values && criteria.values.length > 1 && criteria.values.length <= 5 && (
                <div className="filter-form">
                    <form action="#" method="post" className="">

                        {
                            criteria.values.map((item, index) => (
                                <div className="col-12" key={index}>
                                    <div className="form-group">
                                        <div className="radio-box" key={index}>
                                            <div className="radio-inner">
                                                <input
                                                    type="radio"
                                                    name={criteria?.name}
                                                    value={item.label}
                                                    checked={data && data.filters.criteria[criteria.name] ? data.filters.criteria[criteria.name] === item.label: false}
                                                    onChange={(e) => onOptionSelected({name: e.target.name, value: e.target.value})}
                                                />
                                                <span>{item.label}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}


                    </form>
                </div>
            )}
           {/* {criteria && criteria.values && criteria.values.length === 8 && (
                <div className="filter-form">
                    <form action="#" method="post" className="">
                        <div className="row">
                            {criteria.values.map((item, index) => (
                                <Button
                                    label={item.label}
                                    className="btn btn-transparent-2"
                                    onClick={() => console.log("button")}
                                    type="button"
                                />
                            ))}
                        </div>
                    </form>
                </div>
            )}*/}

            {openSubCat && criteria && criteria.values &&
                <SelectCriteria field={criteria} data={data} handleSelection={(option) => onOptionSelected({name: option.name, value: option.value})}/>
            }
        </div>
    );
};

export default Filter;
