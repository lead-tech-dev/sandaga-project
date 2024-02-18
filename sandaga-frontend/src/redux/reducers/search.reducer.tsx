import {SearchActionTypes} from "../types/search.type";
import {Reducer} from "redux";
import {equalCriteria} from "../../helpers/Search";
export interface RecentSearchInterface {
  filters: {
    [key: string]: any;
  },
  limit: number,
  sort: string,
  order: string,
  currentPage: number;
}
export interface SearchState {
  recent: RecentSearchInterface[]
  loading: boolean;
  errors: any;
  success: boolean;
}

const initialState: SearchState = {
  recent: [],
  loading: false,
  errors: null,
  success: false
};

const searchReducer: Reducer = (state = initialState, action: any) => {

  switch (action.type) {
    case SearchActionTypes.SEARCH_REQUEST:
      return {
        ...state,
        loading:  true
      };
      case SearchActionTypes.SEARCH_SUCCESS:
          return {
              ...state,
              success:  true
          };
      case SearchActionTypes.SEARCH_ERROR:
          return {
              ...state,
              errors: action.errors,
              loading:  false,
              success: false
          };
    case SearchActionTypes.ADD_LOCATION:
      let recent = [...state.recent] ;
      let isEqual = false;

        recent.forEach((item: any) => {
            if (equalCriteria(item, action.payload)) {
                isEqual = true;
            }
        })

        if (!isEqual) {
             if (recent.length === 3) {
                recent.pop()
                recent.unshift(action.payload)
            }else if (recent.length < 3) {
                recent.unshift(action.payload)
            }
        }

      return {
        ...state,
        recent: recent
      };

      case SearchActionTypes.DELETE_FILTERS:
          let recentFilters = [...state.recent]
          recentFilters = recentFilters.filter((_, index: number) => index !== action.payload)

          return {
              ...state,
              recent: recentFilters
          }

    case SearchActionTypes.CLEAR_LOCATION:
      return {
        ...state,
        recent: []
      }

    default:
      return state;
  }
}

export default searchReducer;