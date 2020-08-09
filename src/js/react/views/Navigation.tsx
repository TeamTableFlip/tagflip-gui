import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { RouteComponentProps, withRouter } from "react-router-dom";

interface State {
    activeLink: string
}

type Props = RouteComponentProps;

const initialState = {
    activeLink: "0"
}

/**
 * A React view for displaying the upper navigation bar.
 */
class Navigation extends Component<Props, State> {
    /**
     * Create a new Navigation component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    /**
     * Render the Navigation component.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <Navbar id="topNav" bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="/">TagFlip</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto" activeKey={this.state.activeLink} onSelect={k => this.setState({ activeLink: k })}>
                        <Nav.Link onSelect={() => this.props.history.push("/editor")} eventKey="0">Editor</Nav.Link>
                        <Nav.Link onSelect={() => { this.props.history.push("/settings") }} eventKey="1">Settings</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withRouter(Navigation);