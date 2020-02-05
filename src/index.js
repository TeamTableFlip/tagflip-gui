import ReactDOM from "react-dom";
import React, {Component} from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/app.scss'
import App from "./js/App";


const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : false;