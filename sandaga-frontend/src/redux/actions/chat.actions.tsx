import {
    headersWithAuthorization,
    MESSAGE_URL
} from "../../hooks/useConfig";
import { ChatActionTypes } from "../types/chat.type";


export const createChat = (data: { ads: string; receiver: string; sender: string; owner: string; dest: string; message: string }) => (dispatch: any) => {

    dispatch({ type: ChatActionTypes.MESSAGE_REQUEST });
    fetch(MESSAGE_URL, {
        method: "POST",
        mode: "cors",
        headers: {
            ...headersWithAuthorization(),
        },
        body: JSON.stringify(data),
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {

            if (!response.ok) {
                dispatch({
                    type: ChatActionTypes.MESSAGE_ERROR,
                    errors: json,
                });
                return { success: false, errors: json };
            }
            dispatch({
                type: ChatActionTypes.MESSAGE_SUCCESS,
                payload: json
            });
            //dispatch(getAuthUserData());
            //return { success: true};
        })
        .catch((err) => {
            dispatch({
                type: ChatActionTypes.MESSAGE_ERROR,
                errors: handleError(err),
            });
        });
};

const handleError = (error: any) => {
    const err = new Map([
        [TypeError, "Can't connect to server."],
        [SyntaxError, "There was a problem parsing the response."],
        [Error, error.message],
    ]).get(error.constructor);
    return err;
};
