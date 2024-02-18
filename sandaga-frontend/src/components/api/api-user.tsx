import {headersWithAuthorization, PAYMENT_URL} from "../../hooks/useConfig";

const stripeUpdate = (auth_code: any) => {
    return fetch(PAYMENT_URL + '/stripe_auth', {
        method: 'PUT',
        headers: {
            ...headersWithAuthorization()
        },
        body: JSON.stringify({code: auth_code})
    }).then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) =>  {
        if (!response.ok) {
            return {error: json}
        }
            return json;
    }).catch((err) => {
        console.log(err)
    })
}

const stripeDelete = () => {
    return fetch(PAYMENT_URL + '/stripe_delete', {
        method: 'PUT',
        headers: {
            ...headersWithAuthorization()
        }
    }).then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) =>  {
            if (!response.ok) {
                return {success: false, error: json}
            }
            return {success: true, data: json};
        }).catch((err) => {
            console.log(err)
        })
}
export {
    stripeUpdate,
    stripeDelete
}
