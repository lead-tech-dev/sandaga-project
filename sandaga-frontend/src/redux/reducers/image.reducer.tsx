import { ImageActionTypes } from "../types/ads.type";
import { AuthActionTypes } from "../types/auth.type";

export interface AdsState {
  images: any;
  success: boolean;
  errors: any;
  image_loading: boolean;
}

const initialState: AdsState = {
  images: [],
  errors: null,
  success: false,
  image_loading: false
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case ImageActionTypes.IMAGE_REQUEST:
      return {
        ...state,
        image_loading: true,
      };
    case ImageActionTypes.IMAGE_SUCCESS:
      let images = [...state.images];
      images.push(action.payload);
      return {
        ...state,
        images: images,
        success: true,
        image_loading: false,
        errors: null,
      };
    case ImageActionTypes.IMAGE_ERROR:
      return {
        ...state,
        errors: action.errors,
        images: [],
        image_loading: false,
      };
    case AuthActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        errors: null,
        images: [],
        loading: false,
        success: false,
      };

    default:
      return state;
  }
}
