import React, {Fragment, FunctionComponent, useEffect, useState} from 'react';
import {CardElement, injectStripe} from "react-stripe-elements";
import {withStyles} from "material-ui/styles";

const styles = (theme: any) => ({
    subheading: {
        color: 'rgba(88, 114, 128, 0.87)',
        marginTop: "20px",
    },
    checkout: {
        float: 'right',
        margin: '20px 30px'
    },
    error: {
        display: 'inline',
        padding: "0px 10px"
    },
    errorIcon: {
        verticalAlign: 'middle'
    },
    StripeElement: {
        display: 'block',
        margin: '24px 0 10px 0px',
        maxWidth: '408px',
        padding: '10px 14px',
        boxShadow: 'rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px',
        borderRadius: '4px',
        background: 'white'
    }
})

interface PlaceOrderProps {
    stripe: any;
    classes: any;
    handleCreditCardError: (error: any) => void;
    handleStripe: (stripe: any) => void;
}
const CreditCard: FunctionComponent<PlaceOrderProps> = ({stripe, classes, handleCreditCardError, handleStripe}) => {
    const [error, setError] = useState<{code: string; message: string; type: string} | null>(null)

    useEffect(() => {
       if (stripe) {
           handleStripe(stripe)
       }

    }, [stripe]);
    const handleOnChange = (e: any) => {

        if (e.error) {
            setError(e.error)
        }else {
            setError(null);
        }

        handleCreditCardError(e);
    }

    return (
        <Fragment>
            <CardElement
                onChange={(e: any) => handleOnChange(e)}
                className={classes.StripeElement}
                {...{style: {
                        base: {
                            color: '#424770',
                            letterSpacing: '0.025em',
                            fontFamily: 'Montserrat, sans-serif',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    }
                }}
            />
            {error && <p style={{color: "red"}}>{error.message}</p>}
        </Fragment>
    )
}

export default injectStripe(withStyles(styles)(CreditCard));