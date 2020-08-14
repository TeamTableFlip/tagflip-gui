import { Component, Fragment } from "react";
import React from "react";


class Home extends Component {

    /**
     * Render the Application.
     * @returns {*} The component to be rendered, representing the Application.
     */
    render() {
        return (
            <div className="content">
                <h2>Welcome to TagFlip!</h2>
                <p>
                    TagFlip is an online text annotation tool designed to be (or rather become) a lightweight replacement
                    for <a href="https://brat.nlplab.org/">BRAT</a>.
                </p>
                <p>
                    To start, either go to the <a href="/settings">Settings</a> to set up a corpus and your annotation sets
                    or start the <a href="/editor">annotation editor</a>.
                </p>
            </div>
        );
    }
}

export default Home;