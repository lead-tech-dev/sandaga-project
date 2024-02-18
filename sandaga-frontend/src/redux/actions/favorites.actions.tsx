import {FAVORITES_URL, headersWithAuthorization} from "../../hooks/useConfig";
import {getAuthUserData} from "./auth.actions";
import {FavoritesTypes} from "../types/favorites.type";
import {AuthActionTypes} from "../types/auth.type";


export const addToFavorites = (adsId: string) => async (dispatch: any) => {
    dispatch({ type: FavoritesTypes.FAVORITES_REQUEST });

    return fetch(FAVORITES_URL, {
        method: "POST",
        mode: "cors",
        headers: {
            ...headersWithAuthorization(),
        },
        body: JSON.stringify(adsId)
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return dispatch({
                    type: FavoritesTypes.FAVORITES_FAILURE,
                    errors: json,
                });
            }

            dispatch({ type: FavoritesTypes.FAVORITES_SUCCESS});
            dispatch({ type: AuthActionTypes.ADD_FAVORITE, payload: json});
        })
        .catch((e) => {
            dispatch({ type: FavoritesTypes.FAVORITES_FAILURE, errors: e });
        });
};

export const deleteFavorite = (id: string) => async (dispatch: any) => {
    dispatch({ type: FavoritesTypes.FAVORITES_REQUEST });

    return fetch(FAVORITES_URL + "/" + id, {
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
                    type: FavoritesTypes.FAVORITES_FAILURE,
                    errors: json,
                });
            }

            dispatch({ type: FavoritesTypes.FAVORITES_SUCCESS});
            dispatch(getAuthUserData())

        })
        .catch((e) => {
            dispatch({ type: FavoritesTypes.FAVORITES_FAILURE, errors: e });
        });
};
