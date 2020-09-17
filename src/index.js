import React from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { CookiesProvider } from 'react-cookie';
import { Provider } from "react-redux";
import store from "./redux/store/index";
import App from "./App";
import "./custom.css"
ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <CookiesProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </CookiesProvider>
    </I18nextProvider>, document.getElementById("root"));
