import { AuthActionTypes } from "../types/auth.type";
import { GlobalsActionTypes } from "../types/globals.type";


export interface SignupProps {
 [key: string]: string;
}

export interface FavoritesProps {
  id: string; adsId: string; subject: string; imageUrl: string; categoryName: string; categoryId: string; createdAt: string
}
export interface CredentialsProps {
  username: string;
  firstname: string;
  civility: string;
  hidePhone: boolean;
  lastname: string;
  email: string;
  phone: string;
  accountType: number;
  createdAt: string;
  userId: string;
  followings: {id: string; name: string}[];
  favorites: any;
  address: any;
  image: {id: string; name: string; url: string };
  searches: any;
  chatsMessagePendingNumber: number;
  stripe_user_id: string | null;
}
export interface AuthState {
  authenticated: boolean;
  success: boolean;
  reset_password: boolean;
  reset_token: string;
  loading: boolean
  credentials: CredentialsProps | null;

  errors: any | null;
  role: string;
  follow_loading: boolean;
  update_loading: boolean;
  update_success: boolean;
  contact_success: boolean;
  contact_loading: boolean;
  signupFlow: SignupProps;
}

const initialState: AuthState = {
  authenticated: false,
  success: false,
  loading: false,
  credentials: null,
  role: "",
  errors: {},
  reset_password: false,
  reset_token: "",
  signupFlow: {},
  follow_loading: false,

  update_loading: false,
  update_success: false,

  contact_success: false,
  contact_loading: false,

};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case AuthActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        authenticated: true,
        errors: null,
      };

    case AuthActionTypes.SIGN_IN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case AuthActionTypes.SET_ROLE:
      return {
        ...state,
        role: action.payload,
      };

    case AuthActionTypes.SING_IN_DATA:
      return {
        ...state,
        credentials: {
          ...state.credentials,
          email: action.payload.email,
          civility: action.payload.civility,
          hidePhone: action.payload.hidePhone,
          phone: action.payload.phone,
          firstname: action.payload.firstName,
          lastname: action.payload.lastName,
          username: action.payload.username,
          accountType: action.payload.accountType,
          createdAt: action.payload.createdAt,
          userId: action.payload.id,
          followings: action.payload.followings,
          favorites: action.payload.favorites,
          address: action.payload.address,
          image: action.payload.image,
          searches: action.payload.searches,
          chatsMessagePendingNumber: action.payload.chatsMessagePendingNumber,
          stripe_user_id: action.payload.stripeUserId
        },
        loading: false,
        follow_loading: false,
        update_loading: false,
      };
    case AuthActionTypes.ADD_USER_FOLLOWING:
      return {
        ...state,
        credentials: {
          ...state.credentials,
          followings: state.credentials && [...state.credentials.followings, action.payload],
        }
      };
    case AuthActionTypes.REMOVE_USER_FOLLOWING:
      return {
        ...state,
        credentials: {
          ...state.credentials,
          followings: state.credentials?.followings.filter(item => item.id !== action.id)
        }
      };
    case AuthActionTypes.ADD_USER_IMAGE:
      return {
        ...state,
        credentials: {
          ...state.credentials,
          image: action.payload,
        }
      };
    case AuthActionTypes.UPDATE_USER_IMAGE:
      return {
        ...state,
        credentials: {
          ...state.credentials,
          image: action.payload,
        }
      };
    case AuthActionTypes.DELETE_USER_IMAGE:
      return {
        ...state,
        credentials: {
          ...state.credentials,
          image: null,
        }
      };
    case AuthActionTypes.UPDATE_USER_ADDRESS:
      return {
        ...state,
        credentials: {
          ...state.credentials,
          address: action.payload,
        }
      };
    case AuthActionTypes.ADD_USER_ADDRESS:
      return {
        ...state,
        credentials: {
          ...state.credentials,
          address: action.payload,
        }
      };
    case AuthActionTypes.UPDATE_USER_INFO:
      return {
        ...state,
        credentials: {
          ...state.credentials,
          civility: action.payload.civility,
          hidePhone: action.payload.hidePhone,
          phone: action.payload.phone,
          firstname: action.payload.firstName,
          lastname: action.payload.lastName
        }
      };
    case AuthActionTypes.INIT_PENDING_MESSAGE_NUMBER:
      return {
        ...state,
        credentials: {...state.credentials,  chatsMessagePendingNumber: 0}
      };
    case AuthActionTypes.ADD_PENDING_MESSAGE_NUMBER:
      return {
        ...state,
        credentials: {...state.credentials,  chatsMessagePendingNumber: state.credentials && state.credentials.chatsMessagePendingNumber + action.nbr}
      };
    case AuthActionTypes.REMOVE_PENDING_MESSAGE_NUMBER:
      return {
        ...state,
        credentials: {...state.credentials,  chatsMessagePendingNumber: state.credentials && state.credentials.chatsMessagePendingNumber - action.nbr}
      };
    case AuthActionTypes.ADD_FAVORITE:
      return {
        ...state,
        credentials: {...state.credentials, favorites: state.credentials && [...state.credentials.favorites, action.payload]}
      };
    case AuthActionTypes.REMOVE_FAVORITE:
      return {
        ...state,
        credentials: {...state.credentials, favorites: state.credentials?.favorites.filter((item: any) => item.id !== action.id)}
      };
    case AuthActionTypes.ADD_SEARCHES:
      return {
        ...state,
        credentials: {...state.credentials, searches: state.credentials && [...state.credentials.searches, action.payload]}
      };
    case AuthActionTypes.REMOVE_SEARCHES:
      return {
        ...state,
        credentials: {...state.credentials, searches: state.credentials?.searches.filter((item: any) => item.id !== action.id)}
      };
    case AuthActionTypes.ADD_STRIPE_USER_ID:
      return {
        ...state,
        credentials: {...state.credentials,  stripe_user_id: action.payload }
      };
    case AuthActionTypes.DELETE_STRIPE_USER_ID:
      return {
        ...state,
        credentials: {...state.credentials,  stripe_user_id: null }
      };
    case AuthActionTypes.SING_IN_FAILURE:
      return {
        ...state,
        errors: action.errors,
        authenticated: false,
        loading: false,
        credentials: null,
        token: {},
      };

    case AuthActionTypes.CONTACT_LOADING:
      return {
        ...state,
        contact_loading: true
      };
    case AuthActionTypes.CONTACT_SUCCESS:
      return {
        ...state,
        contact_success: true,
        contact_loading: false
      };
    case AuthActionTypes.CONTACT_FAILURE:
      return {
        ...state,
        errors: action.errors,
        contact_loading: false
      };

    case GlobalsActionTypes.CLEAR_ERRORS:
      return {
        ...state,
        errors: {},
        success: false,
        loading: false,
        reset_password: false,
        reset_token: "",
        update_loading: false,
        update_success: false,
        contact_loading: false,
        contact_success: false
      };
    case AuthActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        errors: {},
        authenticated: false,
        loading: false,
        credentials: null,
      };
    case GlobalsActionTypes.LOADING:
      return {
        ...state,
        loading: true,
      };
    case GlobalsActionTypes.UPDATE_SUCCESS:
      return {
        ...state,
        update_success: true,
      };
    case GlobalsActionTypes.UPDATE_LOADING:
      return {
        ...state,
        update_loading: true,
      };
    case AuthActionTypes.UPDATE_FAILURE:
      return {
        ...state,
        errors: action.errors,
        update_loading: false,
        update_success: false
      };

    case GlobalsActionTypes.FOLLOW_LOADING:
      return {
        ...state,
        follow_loading: true,
      };
    case GlobalsActionTypes.SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
      };
    case GlobalsActionTypes.RESET:
      return {
        ...state,
        reset_password: true,
        reset_token: action.payload,
      };
    default:
      return state;
  }
}
