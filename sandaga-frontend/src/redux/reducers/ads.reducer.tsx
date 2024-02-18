import {
  AdsInterface,
  postedAdInterface,
} from "../../interfaces/ads.interface";
import { AdsActionTypes, PostedAdsActionTypes } from "../types/ads.type";
import { GlobalsActionTypes } from "../types/globals.type";

export interface AdsState {
  ad: any;
  ads: AdsInterface;
  postedAd: postedAdInterface | null;
  loading: boolean;
  success: boolean;
  errors: any;
}

const initialState: AdsState = {
  ad: null,
  ads: { step_0: { data: {}, active: true, errors: [] } },
  postedAd: null,
  loading: false,
  errors: null,
  success: false,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case AdsActionTypes.INIT_ADS_DATA:
      return {
        ...state,
        ads: { step_0: { data: {}, active: true, errors: [] } },
      };
    case AdsActionTypes.GLOBAL_STEP:
      state.ads[action.key] = {
        data: action.data,
        active: action.active,
        errors: action.errors,
      };
      return {
        ...state,
        ads: { ...state.ads },
      };
    case AdsActionTypes.ADD_DATA_STEP:
      state.ads[`step_${action.currentStep}`].data = {
        ...state.ads[`step_${action.currentStep}`].data,
        [action.option.label]: action.option.value,
      };
      return {
        ...state,
        ads: { ...state.ads },
      };
    case AdsActionTypes.REMOVE_DATA_STEP:
      if (action.label.startsWith("Photo") && state.ads[`step_${action.currentStep}`].data) {
        let localState = {}  as {[key: string]: any};

        delete state.ads[`step_${action.currentStep}`].data[`${action.label}`];

        let data = Object.entries(state.ads[`step_${action.currentStep}`].data);

        data.forEach((item, index) => {
          localState = {...localState, [`Photo ${index + 1}`]: item[1]}
        })

        state.ads[`step_${action.currentStep}`].data = {...localState}
      }else {
        delete state.ads[`step_${action.currentStep}`].data[action.label]
      }

      return {
        ...state,
        ads: { ...state.ads },
      };
    case AdsActionTypes.NEXT_STEP:
      state.ads[`step_${action.currentStep}`] = {
        ...state.ads[`step_${action.currentStep}`],
        active: false,
      };

      state.ads[`step_${action.currentStep + 1}`] = {
        ...state.ads[`step_${action.currentStep + 1}`],
        active: true,
      };
      return {
        ...state,
        ads: { ...state.ads },
      };
    case AdsActionTypes.PREVIOUS_STEP:
      state.ads[`step_${action.currentStep}`] = {
        ...state.ads[`step_${action.currentStep}`],
        active: false,
      };

      state.ads[`step_${action.currentStep - 1}`] = {
        ...state.ads[`step_${action.currentStep - 1}`],
        active: true,
      };
      return {
        ...state,
        ads: { ...state.ads },
      };
    case AdsActionTypes.ERRORS_STEP:
      if (action.isError) {
        if (
          !state.ads[`step_${action.currentStep}`].errors.includes(action.label)
        ) {
          state.ads[`step_${action.currentStep}`].errors.push(action.label);
        }
      } else {
        state.ads[`step_${action.currentStep}`] = {
          ...state.ads[`step_${action.currentStep}`],
          errors: state.ads[`step_${action.currentStep}`].errors.filter(
            (item: string) => item !== action.label,
          ),
        };
      }
      return {
        ...state,
        ads: { ...state.ads },
      };
    case PostedAdsActionTypes.ADS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case PostedAdsActionTypes.ADS_SUCCESS:
      return {
        ...state,
        postedAd: action.payload,
        success: true,
        loading: false,
        errors: null,
      };
    case PostedAdsActionTypes.ADS_ERROR:
      return {
        ...state,
        errors: action.errors,
        loading: false,
      };

    case GlobalsActionTypes.CLEAR_ERRORS:
      return {
        ...state,
        errors: null,
        loading: false,
        success: false,
        ads: { step_0: { data: {}, active: true, errors: [] } },
      };
    default:
      return state;
  }
}
