import React from "react";
import ReactDOM from "react-dom/client";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { save, load } from "redux-localstorage-simple";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootStore from "./redux/rootStore";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./assets/scss/globals.scss";

const store = createStore(
    rootStore,
    load(),
    composeWithDevTools(applyMiddleware(thunk, save()))
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
   /* <Provider store={store}>
      <React.StrictMode>
            <App />
      </React.StrictMode>
    </Provider>*/
    <Provider store={store}>

            <App />

    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
