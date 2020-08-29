import React, {Component} from "react";
import {Route, RouteComponentProps, withRouter} from "react-router-dom";
import NewAnnotationProject from "./new/NewAnnotationProject";
import { SidebarHeader, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faGem} from '@fortawesome/free-solid-svg-icons'
import {AutoCollapseSidebar} from "../../components/AutoCollapseSidebar/AutoCollapseSidebar";
import {Card} from "react-bootstrap";

interface State {
    activeLink: string
}

type Props = RouteComponentProps;

const initialState = {
    activeLink: "0"
}

/**
 * The Settings view containing Routes for Corpus- and Annotation-Setup.
 */
class AnnotationProjectSettings extends Component<Props, State> {
    /**
     * Create a new Settings component.
     * @param props The properties of the pomponent.
     */
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    /**
     * Render the Settings view.
     * @returns {*} The component to be rendered.
     */
    render() {
        const {match} = this.props;
        return (
            <>
                <AutoCollapseSidebar animateTransition={true}>
                    <SidebarHeader>
                        <h2 className="h5 p-3 text-center font-weight-light">Annotation Projects</h2>
                    </SidebarHeader>
                    <Menu iconShape="square">
                        <MenuItem icon={<FontAwesomeIcon icon={faGem} />}>Dashboard</MenuItem>
                        <SubMenu title="Components" icon={<FontAwesomeIcon icon={faGem} />}>
                            <MenuItem>Component 1</MenuItem>
                            <MenuItem>Component 2</MenuItem>
                        </SubMenu>
                    </Menu>
                </AutoCollapseSidebar>
                <section id="content">
                    <Route exact={true} path={`${match.path}/new`}>
                        <NewAnnotationProject/>
                    </Route>
                </section>
            </>
        );
    }
}

export default withRouter(AnnotationProjectSettings);
