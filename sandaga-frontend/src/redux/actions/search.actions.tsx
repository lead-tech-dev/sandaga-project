import {headersWithAuthorization, SEARCHES_URL} from "../../hooks/useConfig";
import {getAuthUserData} from "./auth.actions";
import {SearchActionTypes} from "../types/search.type";
import {AuthActionTypes} from "../types/auth.type";


export const addSearch = (data: any) => async (dispatch: any) => {
    dispatch({ type: SearchActionTypes.SEARCH_REQUEST });

    return fetch(SEARCHES_URL, {
        method: "POST",
        mode: "cors",
        headers: {
            ...headersWithAuthorization(),
        },
        body: JSON.stringify(data)
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return dispatch({
                    type: SearchActionTypes.SEARCH_ERROR,
                    errors: json,
                });
            }

            dispatch({ type: SearchActionTypes.SEARCH_SUCCESS});
            dispatch({ type: AuthActionTypes.ADD_SEARCHES, payload: json});
            //dispatch(getAuthUserData())

        })
        .catch((e) => {
            dispatch({ type: SearchActionTypes.SEARCH_ERROR, errors: e });
        });
};

export const deleteSearch = (id: string) => async (dispatch: any) => {
    dispatch({ type: SearchActionTypes.SEARCH_REQUEST });

    return fetch(SEARCHES_URL + "/" + id, {
        method: "DELETE",
        mode: "cors",
        headers: {
            ...headersWithAuthorization(),
        }
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return dispatch({
                    type: SearchActionTypes.SEARCH_ERROR,
                    errors: json,
                });
            }

            dispatch({ type: SearchActionTypes.SEARCH_SUCCESS});
           // dispatch(getAuthUserData())

        })
        .catch((e) => {
            dispatch({ type: SearchActionTypes.SEARCH_ERROR, errors: e });
        });
};

