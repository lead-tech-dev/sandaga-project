import { combineReducers } from "redux";
import authReducer from "./reducers/auth.reducer";
import adsReducer from "./reducers/ads.reducer";
import imageReducer from "./reducers/image.reducer";
import searchReducer from "./reducers/search.reducer";
import favoritesReducer from "./reducers/favorites.reducer";
import chatReducer from "./reducers/chat.reducer";
import paymentReducer from "./reducers/payment.reducer";

const rootStore = combineReducers({
  auth: authReducer,
  adsData: adsReducer,
  images: imageReducer,
  favorites: favoritesReducer,
  search: searchReducer,
  chat: chatReducer,
  payment: paymentReducer
});

export default rootStore;

