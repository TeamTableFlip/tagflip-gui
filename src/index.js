import ReactDOM from "react-dom";
import React, {Component} from "react";

import './css/app.scss'


const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<div>Hello World, TagFlip!</div>, wrapper) : false;