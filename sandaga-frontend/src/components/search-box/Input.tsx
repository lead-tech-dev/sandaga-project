import React from 'react';

type InputProps = {
    type?: string;
    value?: number | string;
    buttonText?: string;
    buttonIcon?: React.ReactNode;
    placeholder?: React.ReactNode;
    bordered?: boolean;
    showSvg?: boolean;
    style?: React.CSSProperties;
    onChange?: (e: any) => void;
    onKeyPress?: (e: any) => void;
    onBlur?: (e: any) => void;
    onClick?: (e: any) => void;
};

const InputSearch: React.FC<InputProps & any> = ({
                                                     type,
                                                     value,
                                                     buttonText,
                                                     buttonIcon,
                                                     placeholder,
                                                     onChange,
                                                     style,
                                                     onKeyPress,
                                                     onBlur,
                                                     onClick,
                                                     onFocus,
                                                     bordered,
                                                     showSvg,
                                                     inputClass,
                                                 }) => {
    return (
        <>
            <div
                style={style}
                //bordered={bordered}
               // showSvg={showSvg}
                className={`search-input-wrapper ${inputClass} ${bordered === true ? 'bordered' : ''}`}
            >
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        onClick();
                    }}
                >
                    {showSvg && (
                        <span className='searchIcon' onClick={onClick}>
              {buttonIcon}
            </span>
                    )}

                            <input
                                type={type}
                                value={value}
                                placeholder={placeholder}
                                onChange={onChange}
                                onFocus={onFocus}
                                onKeyPress={onKeyPress}
                                onBlur={onBlur}
                                className="search-box-search"
                            />


                    {showSvg !== true ? (
                        <button onClick={onClick} className="search-button">
                            {buttonIcon}
                            {buttonText !== '' || null ? (
                                <span className='buttonText'>
                  {buttonText}
                </span>
                            ) : (
                                ''
                            )}
                        </button>
                    ) : (
                        ''
                    )}
                </form>
            </div>
        </>
    );
};
export default InputSearch;
