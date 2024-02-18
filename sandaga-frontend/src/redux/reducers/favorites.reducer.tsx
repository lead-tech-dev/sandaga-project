import {FavoritesTypes} from "../types/favorites.type";
import {GlobalsActionTypes} from "../types/globals.type";


export interface FavoritesState {
    favorites: any;
    success: boolean;
    loading: boolean;
    errors: any;
}

const initialState: FavoritesState = {
    favorites: [],
    errors: null,
    success: false,
    loading: false
};

export default function (state = initialState, action: any) {
    switch (action.type) {
        case FavoritesTypes.FAVORITES_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FavoritesTypes.FAVORITES_SUCCESS:
            return {
                ...state,
                success: true,
                loading: false,
                errors: null,
            };
        case FavoritesTypes.FAVORITES_FAILURE:
            return {
                ...state,
                errors: action.errors,
                favorites: [],
                loading: false,
            };
        case GlobalsActionTypes.CLEAR_ERRORS:
            return {
                ...state,
                errors: null,
                loading: false,
                success: false,
            };
        default:
            return state;
    }
}
