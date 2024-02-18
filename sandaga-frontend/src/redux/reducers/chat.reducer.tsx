import { ChatActionTypes } from "../types/chat.type";
import {GlobalsActionTypes} from "../types/globals.type";

export interface MessageProps { id: string; receiver: string; sender: string; messages: string; createdAt: Date }

export interface ChatState {
    message: MessageProps | null;
    success: boolean;
    errors: any;
    chat_loading: boolean;
}

const initialState: ChatState = {
    message: null,
    errors: null,
    success: false,
    chat_loading: false
};

export default function (state = initialState, action: any) {
    switch (action.type) {
        case ChatActionTypes.MESSAGE_REQUEST:
            return {
                ...state,
                chat_loading: true,
            };
        case ChatActionTypes.MESSAGE_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                success: true,
                chat_loading: false,
                errors: null,
            };
        case ChatActionTypes.MESSAGE_ERROR:
            return {
                ...state,
                errors: action.errors,
                message: null,
                chat_loading: false,
            };
        case GlobalsActionTypes.CLEAR_ERRORS:
            return {
                ...state,
                errors: null,
                chat_loading: false,
                success: false,
                message: null
            };
        default:
            return state;
    }
}
