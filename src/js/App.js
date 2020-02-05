import React, {Component} from "react";
import Navigation from "./components/Navigation";
import Content from "./components/Content";
import Footer from "./components/Footer";

class App extends Component {

    render() {
        return (
            <div id="page">
                <Navigation />
                <Content />
                <Footer />
            </div>);
    }
}

export default App;