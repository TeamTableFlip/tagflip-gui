import React, { Component } from "react";
import Navigation from "./views/Navigation";
import Footer from "./views/Footer";

import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

import Settings from "./views/settings/Settings";
import Editor from "./views/editor/Editor";
import { ActionCreators } from "../redux/actions/ActionCreators";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import config from '../config/config';
import ServerNotAvailableInfo from "./components/dialogs/ServerNotAvailableInfo";

__webpack_public_path__ = process.env.ASSET_PATH;

/**
 * The root React Component representing the TagFlip Application. Does NOT contain the redux store.
 */
class App extends Component {
    /**
     * React lifecycle method. Check the Server availability.
     */
    componentDidMount() {
        this.checkServerAvailability();
    }

    /**
     * Check the server availability. Will be called every 5 seconds.
     */
    checkServerAvailability() {
        let timeOut = config.backend.checkAvailabilityTimeout;
        if (!this.props.serverStatus.available) {
            timeOut = 5000;
        }
        this.props.fetchServerStatus();
        setTimeout(() => this.checkServerAvailability(), timeOut);
    }

    /**
     * Render the Application.
     * @returns {*} The component to be rendered, representing the Application.
     */
    render() {
        return (
            <div id="page">
                <Router basename={process.env.ASSET_PATH}>
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
            </div >);
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