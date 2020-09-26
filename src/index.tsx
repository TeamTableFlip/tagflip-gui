import ReactDOM from "react-dom";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './css/app.scss'

import App from "./js/react/App";
import { store, persistor } from "./js/redux/Store";
import { Auth0Provider } from '@auth0/auth0-react';
import { OidcSettings } from '../.oidcsettings';


/**
 * @file Root of the react application
 * @copyright 2020 TagFlip team
 * @copyright 2020 Fachhochschule Südwestfalen
 * @license MIT
 */

const wrapper = document.getElementById("app");

wrapper
    ? ReactDOM.render(
        (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <App />
                </PersistGate>
            </Provider>
        ),
        wrapper
    )
    : false;
