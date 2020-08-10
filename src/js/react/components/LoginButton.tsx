import React, { Component } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withAuth0, Auth0ContextInterface } from "@auth0/auth0-react";
import "./LoginButton.scss"
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface Props {
    auth0: Auth0ContextInterface
}

class LoginButton extends Component<Props> {

    constructor(props) {
        super(props);
    }

    render() {
        const { logout, loginWithRedirect, user, isAuthenticated } = this.props.auth0;

        console.log('user: %o, isAuthenticated: %s', user, isAuthenticated);
        let info = <span></span>;
        let icon = <FontAwesomeIcon icon={faUser} color="white" size="2x" />;
        if (user) {
            info = <div className="user-info">
                <img src={user.picture} className="user-icon" />
                <aside>
                    <div>{user.name}</div>
                    <div>{user.email}</div>
                </aside>
            </div>
            icon = <img src={user.picture} className="user-icon" />;
        }
        return (
            <React.Fragment>

                <Dropdown alignRight>
                    <Dropdown.Toggle id="loginToggle" bsPrefix="my-dropdown" as="a">
                        {icon}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {info}
                        <Dropdown.Item disabled={isAuthenticated} onClick={() => loginWithRedirect()}>Log In</Dropdown.Item>
                        <Dropdown.Item disabled={!isAuthenticated} onClick={() => logout()}>Log Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </React.Fragment>
        );
    }
};

export default withAuth0(LoginButton);
