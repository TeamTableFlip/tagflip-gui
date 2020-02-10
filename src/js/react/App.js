import React, {Component} from "react";
import Navigation from "./views/Navigation";
import Footer from "./views/Footer";

import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Settings from "./views/settings/Settings";
import Editor from "./views/editor/Editor";

class App extends Component {

    render() {
        return (
            <div id="page">
                <Router>
                    <Navigation />
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

export default App;