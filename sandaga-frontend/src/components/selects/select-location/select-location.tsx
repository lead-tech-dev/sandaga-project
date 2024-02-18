import React, {Fragment, FunctionComponent, memo, useEffect, useRef, useState} from 'react';
import Location from "../../../assets/icons/Location";
import Input from "../../Input";
import Button from "../../Button";
import Close from "../../../assets/icons/Close";
import {connect,ConnectedProps, useDispatch} from "react-redux";
import {SearchActionTypes} from "../../../redux/types/search.type";
import {State} from "../../../redux/types";

import "./select-location.style.scss";
import {storeFilters} from "../../../helpers/Search";
import {useSearchParams} from "react-router-dom";
import {getUrls} from "../../../helpers/Poster";

interface SelectLocationInterface {
    onOptionSelected?: (
        option: {name: string; value: string},
    ) => void;

    onOptionDelete: (name: string) => void;
    label?: string;
    recent: any;
}
const SelectLocation: FunctionComponent<SelectLocationInterface & SelectLocationProps> = ({onOptionDelete, label, onOptionSelected, recent: {filters}}) => {
    const [isOpen, setIsOpen] = useState<Boolean>(false);
    const labelRef = useRef<HTMLButtonElement>(null);
    const ref = React.useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<{radius: number; address: string}>({radius: 5, address: ""});
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [token, setToken] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const [suggestions, setSuggestions] = useState<Array<{ place_name: string }>>(
        []
    );
    let searchRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();


    useEffect(() => {
        document.addEventListener('click', handleClickOutside, false);
        return () => {
            document.removeEventListener('click', handleClickOutside, false);
        };
    }, []);

    useEffect(() => {
        const accessToken = 'pk.eyJ1IjoibWF4aW1hbjgxIiwiYSI6ImNrZXBuaGE3ZTA0NXMycHI2NWoxcGx1cjEifQ.YIL3v3KgW2cmLB9e5lS_rA';
        setToken(accessToken)


        if (formData.address) {
            handleSearch(formData.address)
        }

        if (filters.location) {
            setFormData({...formData, radius: filters.location.point.radius})
        }


    }, [formData.address, filters.location])

    const onLabelClick = (e: any) => {
        e.preventDefault();
        setIsOpen(!isOpen);
        ref.current?.focus()
    }
    const handleChange = (e: any) => {
        const {name, value} = e.target;

        if (name === "address" && value.length > 2) {
            setLoading(true)
            setIsEditing(true)
            setFormData({...formData, [name]: value})
        }else if (name === "address") {
            setFormData({...formData, [name]: value})
            setIsEditing(false)
        }

        if (filters.location && name === "radius") {

            setIsEditing(false)
            setFormData({...formData, [name]: parseInt(value)})
        }


    }

    const handleSearch = async (event: string) => {
        try {
            // console.log(event)
            const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${event}.json?country=FR&&types=place&access_token=${token}&autocomplete=true&limit=5`;

            const response = await fetch(endpoint);
            const results = await response.json();
            //console.log({results: results});
            setSuggestions(results?.features);

        } catch (error: any) {
            console.log("Error fetching data: " + error.message);
        }
    };
    const handleSelectAddress = (selectedAddress: any) => {
        const city = selectedAddress.place_name.split(",")[0]
        const point = selectedAddress.geometry.coordinates;

        onOptionSelected && onOptionSelected({
            name: "location",
            value: `${city}_${point[1]}_${point[0]}_${5}`});


        setFormData({...formData, address: ""})
        setSuggestions([]);
        setIsEditing(false);
        setLoading(false)

    };

    const handleClickOutside = (event: any) => {
        if (searchRef.current && !searchRef.current.contains(event.target) ) {
            // setIsOpen(!isOpen)

        }
    };

    const handleRemove = () => {
        onOptionDelete("location")
    }

    const handleValidate = () => {
        filters.location && onOptionSelected && onOptionSelected({
            name: "location",
            value: `${filters.location.city}_${filters.location.point.lat}_${filters.location.point.lng}_${formData.radius}`});

        setIsOpen(!isOpen);


        let store = storeFilters(filters, getUrls(searchParams));

        if (store.filters.keywords || store.filters.location || (store.filters.criteria && Object.keys(store.filters.criteria).length > 1)) {
            dispatch({
                type: SearchActionTypes.ADD_LOCATION,
                payload: store
            })
        }
    }

    return (
        <div className="select-location" ref={searchRef}>
            <button
                ref={labelRef}
                className="select-location__label"
                onClick={(e) => onLabelClick(e)}
                // onBlur={(e) => handleBlur(e)}
            >
                <span>
                  { <Location />}
                    {!filters.location  ? label : filters.location.city + " - " + filters.location.point.radius + " km"}
                </span>

            </button>
            {isOpen && (
                <div className="select-location__search">
                    <div className="">
                        <Location />

                        <Input
                            data={{
                                type: "text",
                                name: "address",
                                id: "mapbox-autofill",
                                placeholder: "Entrer une localisation",
                                value: formData.address,
                                ref: ref,
                                autoComplete: "none"
                            }}
                            handleChange={(e) => handleChange(e)}
                            className="location"
                            autoFocus={true}
                        />
                    </div>
                    {isEditing && (
                        <div className="suggestions">
                            <ul>
                                {suggestions.length > 0 ? suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSelectAddress(suggestion)}
                                    >
                                        {/*Chartres (28300)*/}
                                        {suggestion.place_name}
                                    </li>
                                )) : <p>Pas de résultats</p>}
                            </ul>
                        </div>
                    )}
                    {!loading && filters.location && (
                        <Fragment>
                            <div className="content">
                                <div className="result">
                                    {filters.location && (
                                        <span>
                                            {filters.location.city}
                                            <Close onClick={() => handleRemove()}/>
                                       </span>
                                    )}
                                </div>
                                <div className="search">
                                    <Input
                                        data={{
                                            label: "Dans un rayon de: ",
                                            type: "range",
                                            name: "radius",
                                            id: "radius",
                                            value: formData.radius,
                                            ref: ref,
                                            radius: `${formData.radius} km`,
                                            min: 0,
                                            max: 100,
                                            step: 5
                                        }}
                                        style={{
                                            background: `linear-gradient(to right, #009e7f 0%, #009e7f ${formData.radius}%, #fff ${formData.radius}%, #fff 100%)`}}
                                        className="input-radius"
                                        handleChange={(e) => handleChange(e)}
                                    />
                                </div>
                            </div>
                            <div className="footer">
                                <div className="left">
                                    <Button
                                        label="Effacer"
                                        type="button"
                                        className="btn-canceled right "
                                        onClick={() => handleRemove()}
                                    />
                                </div>
                                <div className="right">
                                    <Button
                                        label="Valider"
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => handleValidate()}
                                    />
                                </div>
                            </div>
                        </Fragment>
                    )}
                </div>
            )}
        </div>
    );
};
const mapStateToProps = (state: State) => ({
    search: state.search,
});


const connector = connect(mapStateToProps, null);

type SelectLocationProps = ConnectedProps<typeof connector>;

export default connector(memo(SelectLocation))
