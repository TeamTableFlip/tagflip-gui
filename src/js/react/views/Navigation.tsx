import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { RouteComponentProps, withRouter } from "react-router-dom";
import LoginButton from "../components/LoginButton/LoginButton";
import {Button} from "react-bootstrap";
import {toast, ToastContainer} from "react-toastify";
import {Auth0Provider} from "@auth0/auth0-react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faFlagCheckered} from '@fortawesome/free-solid-svg-icons'
import Dropdown from "react-bootstrap/Dropdown";

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
                <Navbar.Brand id="brand" href="#" onClick={() => this.props.history.push("/")}>TagFlip</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto" activeKey={this.state.activeLink} onSelect={k => this.setState({ activeLink: k })}>
                        <Nav.Link onSelect={() => this.props.history.push("/annotationprojects")} eventKey="1">Annotation Projects</Nav.Link>
                        <Nav.Link onSelect={() => this.props.history.push("/corpora")} eventKey="2">Corpora</Nav.Link>
                        <Nav.Link onSelect={() => this.props.history.push("/annotationsets")} eventKey="3">Annotation Sets</Nav.Link>
                        <Nav.Link onSelect={() => this.props.history.push("/editor")} eventKey="4">Editor</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Dropdown alignRight>
                    <Dropdown.Toggle id="loginToggle" as={Nav.Link} className="user-toggle">
                        <FontAwesomeIcon icon={faPlus} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onSelect={() => {
                            this.setState({ activeLink: "0" })
                            this.props.history.push("/annotationprojects/new")
                        }}><FontAwesomeIcon icon={faFlagCheckered} />New Annotation Project</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <LoginButton />
            </Navbar>
        );
    }
}

export default withRouter(Navigation);
