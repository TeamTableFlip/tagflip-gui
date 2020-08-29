import React, {Component} from "react";
import Navigation from "./views/Navigation";
import Footer from "./views/Footer";

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Settings from "./views/settings/Settings";
import {ActionCreators} from "../redux/actions/ActionCreators";
import {connect, ConnectedProps} from "react-redux";
import {bindActionCreators} from "redux";

import config from '../config/config';
import ServerNotAvailableInfo from "./components/Dialog/ServerNotAvailableInfo";
import {Auth0Provider} from "@auth0/auth0-react";
import {OidcSettings} from "../../../.oidcsettings";
import {ToastContainer} from "react-toastify";
import Home from "./views/Home";
import AnnotationProjectSettings from "./views/annotationproject/AnnotationProjectSettings";
import CorpusSettings from "./views/corpus/CorpusSettings";
import AnnotationSetSettings from "./views/annotationset/AnnotationSetSettings";


const __webpack_public_path__ = process.env.ASSET_PATH;

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

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

/**
 * The root React Component representing the TagFlip Application. Does NOT contain the redux store.
 */
class App extends Component<PropsFromRedux> {

    constructor(props) {
        super(props);
    }

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


    onRedirectCallback(appState) {
        console.log('onredirect: %o', appState)
    }

    /**
     * Render the Application.
     * @returns {*} The component to be rendered, representing the Application.
     */
    render() {
        return (
            <div id="page">
                <Router basename={process.env.ASSET_PATH}>
                    <Auth0Provider
                        domain={OidcSettings.domain}
                        clientId={OidcSettings.client_id}
                        redirectUri={OidcSettings.redirect_uri}
                        audience={OidcSettings.audience}
                    >
                        <ServerNotAvailableInfo serverAvailable={this.props.serverStatus.available} />
                        <ToastContainer
                            position="bottom-right"
                            hideProgressBar={false}
                            newestOnTop
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                        />
                        <header>
                            <Navigation />
                        </header>
                        <main>
                            <Switch>
                                <Route path="/annotationprojects">
                                    <AnnotationProjectSettings />
                                </Route>
                                <Route path="/corpora">
                                    <CorpusSettings />
                                </Route>
                                <Route path="/annotationsets">
                                    <AnnotationSetSettings />
                                </Route>
                                <Route path="/editor">
                                    {/*<Editor /> // todo reactive when ready*/}
                                </Route>
                                <Route path="/settings">
                                    <Settings />
                                </Route>
                                <Route path="/">
                                    <Home />
                                </Route>
                            </Switch>
                        </main>
                        <Footer />
                    </Auth0Provider>
                </Router>
            </div>);
    }
}

export default connector(App);
