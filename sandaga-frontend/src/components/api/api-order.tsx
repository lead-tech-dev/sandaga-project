import {headersWithAuthorization, PAYMENT_URL, RELAY_URL} from "../../hooks/useConfig";

const create = (order: any) => {
    return fetch(PAYMENT_URL, {
        method: 'POST',
        headers: {
            ...headersWithAuthorization()
        },
        body: JSON.stringify(order)
    })
        .then((response) => {
            return response.json()
        }).catch((err) => console.log(err))
}

const getUserPayments = (data: {currentPage: number; limit: number}) => {
    return fetch(PAYMENT_URL + "/list", {
        method: 'POST',
        headers: {
            ...headersWithAuthorization()
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            return response.json()
        }).catch((err) => console.log(err))
}

const processCharge = (params: any) => {
    return fetch(PAYMENT_URL + '/charge', {
        method: 'PUT',
        headers: {
            ...headersWithAuthorization()
        },
        body: JSON.stringify(params)
    }).then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return {success: false, error: json}
            }
        return {success: true, data: json}

    }).catch((err) => {
        console.log(err)
    })
}

const processCancel = (params: any) => {
    return fetch(PAYMENT_URL + '/cancel', {
        method: 'PUT',
        headers: {
            ...headersWithAuthorization()
        },
        body: JSON.stringify(params)
    }).then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return {success: false, error: json}
            }
            return {success: true, data: json}

        }).catch((err) => {
        console.log(err)
    })
}

const processSend = (params: any) => {
    return fetch(PAYMENT_URL + '/send', {
        method: 'PUT',
        headers: {
            ...headersWithAuthorization()
        },
        body: JSON.stringify(params)
    }).then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return {success: false, error: json}
            }
            return {success: true, data: json}

        }).catch((err) => {
        console.log(err)
    })
}

const processReceive = (params: any) => {
    return fetch(PAYMENT_URL + '/receive', {
        method: 'PUT',
        headers: {
            ...headersWithAuthorization()
        },
        body: JSON.stringify(params)
    }).then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return {success: false, error: json}
            }
            return {success: true, data: json}

        }).catch((err) => {
        console.log(err)
    })
}

const processPaid = (params: any) => {
    return fetch(PAYMENT_URL + '/paid', {
        method: 'PUT',
        headers: {
            ...headersWithAuthorization()
        },
        body: JSON.stringify(params)
    }).then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return {success: false, error: json}
            }
            return {success: true, data: json}

        }).catch((err) => {
        console.log(err)
    })
}

const processSuspend = (params: any) => {
    return fetch(PAYMENT_URL + '/suspend', {
        method: 'PUT',
        headers: {
            ...headersWithAuthorization()
        },
        body: JSON.stringify(params)
    }).then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return {success: false, error: json}
            }
            return {success: true, data: json}

        }).catch((err) => {
        console.log(err)
    })
}

const processRefund = (params: any) => {
    return fetch(PAYMENT_URL + '/refund', {
        method: 'PUT',
        headers: {
            ...headersWithAuthorization()
        },
        body: JSON.stringify(params)
    }).then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return {success: false, error: json}
            }
            return {success: true, data: json}

        }).catch((err) => {
            console.log(err)
        })
}

const processTracking = (params: any) => {
    return fetch(RELAY_URL + 'wSI2_TracingColisDetaille', {
        method: 'POST',
        headers: {
            ...headersWithAuthorization()
        },
        body: JSON.stringify(params)
    }).then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return {success: false, error: json}
            }
            return {success: true, data: json}

        }).catch((err) => {
            console.log(err)
        })
}

export {
    create,
    getUserPayments,
    processCharge,
    processCancel,
    processSend,
    processReceive,
    processPaid,
    processSuspend,
    processTracking,
    processRefund
}