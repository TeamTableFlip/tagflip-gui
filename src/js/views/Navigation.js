import React, {Component} from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {withRouter} from "react-router-dom";

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeLink: "0"
        }
    }


    render() {
        return (
            <Navbar id="topNav" bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="#home">TagFlip</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto" activeKey={this.state.activeLink} onSelect={ k => this.setState({activeLink: k})}>
                        <Nav.Link onSelect={() => this.props.history.push("/editor")} eventKey="0">Editor</Nav.Link>
                        <Nav.Link onSelect={() => { this.props.history.push("/settings") }} eventKey="1">Settings</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withRouter(Navigation);