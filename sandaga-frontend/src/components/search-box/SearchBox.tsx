import InputSearch from './Input';
import React, { useEffect, useRef, useState } from 'react';
import SearchResults from './SearchResult';
import  SearchIcon  from '../../assets/icons/SearchIcon';
import "./search-box.scss"
import {defaultHeaders, SUGGESTION_URL} from "../../hooks/useConfig";
import {useDispatch} from "react-redux";
import {SearchActionTypes} from "../../redux/types/search.type";


type SearchBoxProps = {
    suggestions?: string[];
    buttonText?: string;
    buttonIcon?: React.ReactNode;
    inputStyle?: React.CSSProperties;
    style?: React.CSSProperties;
    bordered?: boolean;
    hideType?: boolean;
    showSvg?: boolean;
    expand?: boolean;
    minimal?: boolean;
    autoSuggestion?: boolean;
    placeholder?: string;
    className?: string;
    handleSearch?: Function;
    handleSelectedResult?: Function
    onClick?: Function;
    value?: any;
    pathname?: string;
};

const Search: React.FC<SearchBoxProps> = ({

                                              buttonText,
                                              buttonIcon,
                                              inputStyle,
                                              style,
                                              bordered,
                                              hideType,
                                              showSvg,
                                              autoSuggestion,
                                              placeholder,
                                              handleSearch,
                                              onClick,
                                              value,
                                              expand,
                                              minimal,
                                              handleSelectedResult
                                          }) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [toggleSuggestion, setToggleSuggestion] = useState(false);
    const [toggleSearch, setToggleSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<{subject: string; category: string}[] | null>(null);
    let searchRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();


    useEffect(() => {

        if (searchValue) {
            setLoading(true);

            fetch(SUGGESTION_URL + "/" + searchValue, {
                method: "GET",
                mode: "cors",
                headers: {
                    ...defaultHeaders(),
                },

            })
                .then((response) => Promise.all([response, response.json()]))
                .then(([response, json]) => {

                    if (response.ok){
                        setSuggestions(json)
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false)
                    console.log(err);
                });
        }else {
            setSuggestions(null)
        }
    }, [searchValue])

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, false);
        return () => {
            document.removeEventListener('click', handleClickOutside, false);
        };
    }, []);



    const handleSearchInput = (event: any) => {
        setSearchValue(event.target.value);
        setToggleSuggestion(true);
        handleSearch && handleSearch(event.target.value);
    };

    /*const ucwords = (str: string) => {
        const newString = str.replace(/\//g, '');
        const humanString = newString.replace(/-/g, ' ');
        return (humanString + '').replace(/^([a-z])|\s+([a-z])/g, function($1) {
            return $1.toUpperCase();
        });
    };*/

    const setSuggestion = (keyword: string, category: string) => {

        handleSelectedResult && handleSelectedResult(keyword, category)
        setToggleSuggestion(false);
        setSearchValue(value);
    };

    const handleClickOutside = (event: any) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setToggleSuggestion(false);
            setToggleSearch(false);
        }
    };

    const onClearBtnClick = (index: number) => {
        setSearchValue('');

        dispatch({
            type: SearchActionTypes.DELETE_FILTERS,
            payload: index
        })
    };

    return (
        <div
            className="search-wrapper"
            ref={searchRef}
            style={style}
            //autoSuggestion={autoSuggestion}
            //hideType={hideType}
            //expand={expand}
        >
            <div
                className={`search-box-wrapper ${hideType ? 'hideType' : ''} ${
                    expand === true ? (toggleSearch ? 'expanded' : 'collapsed') : ''
                } ${minimal === true ? 'minimal' : ''}`}
            >
                <InputSearch
                    type='text'
                    value={value}
                    onChange={handleSearchInput}
                    onFocus={() => setToggleSearch(true)}
                    onBlur={() => setToggleSearch(false)}
                    buttonIcon={buttonIcon}
                    buttonText={buttonText}
                    placeholder={placeholder}
                    style={inputStyle}
                    bordered={bordered}
                    showSvg={showSvg}
                    onClick={() => onClick && onClick(searchValue)}
                />
            </div>
            {autoSuggestion && toggleSuggestion ? (
                <SearchResults
                    suggestions={suggestions}
                    clearSearch={(index: number) => onClearBtnClick (index)}
                    setSuggestionValue={(category: any,  value: string) => setSuggestion(value, category)}
                    searchKey={searchValue}
                    setToggleSuggestion={() => setToggleSuggestion(false)}
                    setSearchValueText={(text) =>  handleSearch && handleSearch(text)}
                />
            ) : null}
        </div>
    );
};

Search.defaultProps = {
    bordered: false,
    autoSuggestion: false,
    buttonText: '',
    buttonIcon: <SearchIcon />,
    placeholder: 'Rechercher...',
    inputStyle: {
        width: '100%',
    },
};

export default Search;
