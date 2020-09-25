import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { RouteComponentProps, withRouter } from "react-router-dom";
import LoginButton from "../components/LoginButton/LoginButton";
import {Auth0Provider} from "@auth0/auth0-react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faFlagCheckered, faTags, faBook} from '@fortawesome/free-solid-svg-icons'
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
                        <Nav.Link onSelect={() => this.props.history.push("/annotationtasks")} eventKey="annotationtasks">Annotation Task</Nav.Link>
                        <Nav.Link onSelect={() => this.props.history.push("/corpora")} eventKey="corpora">Corpora</Nav.Link>
                        <Nav.Link onSelect={() => this.props.history.push("/annotationsets")} eventKey="annotationsets">Annotation Sets</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Dropdown alignRight>
                    <Dropdown.Toggle id="loginToggle" as={Nav.Link} className="user-toggle">
                        <FontAwesomeIcon icon={faPlus} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onSelect={() => {
                            this.setState({ activeLink: "annotationtasks" })
                            this.props.history.push("/annotationtasks/new")
                        }}><FontAwesomeIcon icon={faFlagCheckered} /><span className="ml-2">New Annotation Task</span></Dropdown.Item>
                        <Dropdown.Item onSelect={() => {
                            this.setState({ activeLink: "corpora" })
                            this.props.history.push("/corpora/new")
                        }}><FontAwesomeIcon icon={faBook} /><span className="ml-2">New Corpus</span></Dropdown.Item>

                        <Dropdown.Item onSelect={() => {
                            this.setState({ activeLink: "annotationsets" })
                            this.props.history.push("/annotationsets/new")
                        }}><FontAwesomeIcon icon={faTags} /><span className="ml-2">New Annotation Set</span></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <LoginButton />
            </Navbar>
        );
    }
}

export default withRouter(Navigation);
