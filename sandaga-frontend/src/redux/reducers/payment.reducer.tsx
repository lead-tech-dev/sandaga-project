import {PaymentActionTypes} from "../types/payment.type";

export interface AdsState {
  success: boolean;
  loading: boolean;
}

const initialState: AdsState = {
  success: false,
  loading: false
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case PaymentActionTypes.PAYMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case PaymentActionTypes.PAYMENT_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        errors: null,
      };
    case PaymentActionTypes.PAYMENT_ERROR:
      return {
        ...state,
        success: false,
        loading: false,
      };
    default:
      return state;
  }
}
