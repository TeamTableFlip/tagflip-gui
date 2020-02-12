import React, {Component} from "react";
import Navigation from "./views/Navigation";
import Footer from "./views/Footer";

import {BrowserRouter as Router, Redirect, Route, Switch, withRouter} from "react-router-dom";
import Settings from "./views/settings/Settings";
import Editor from "./views/editor/Editor";
import {ActionCreators} from "../redux/actions/ActionCreators";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import config from '../config/config'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ServerNotAvailableInfo from "./components/ServerNotAvailableInfo";

class App extends Component {

    componentDidMount() {
        this.checkServerAvailability();
    }

    checkServerAvailability() {
        let timeOut = config.backend.checkAvailabilityTimeout;
        if(!this.props.serverStatus.available) {
            timeOut = 5000;
        }
        this.props.fetchServerStatus();
        setTimeout(() => this.checkServerAvailability(), timeOut);
    }

    render() {
        return (
            <div id="page">
                <Router>
                    <Navigation />
                    <ServerNotAvailableInfo serverAvailable={this.props.serverStatus.available} />
                    <main>
                        <Switch>
                            <Route path="/editor">
                                <Editor />
                            </Route>
                            <Route path="/settings">
                                <Settings />
                            </Route>
                            <Route path="/">
                                <Redirect to="/editor" />
                            </Route>
                        </Switch>
                    </main>
                    <Footer />
                </Router>
            </div>);
    }
}


/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        serverStatus: state.serverStatus
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);