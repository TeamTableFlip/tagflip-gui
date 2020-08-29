import React, {Component} from "react";
import CorporaList from "../corpus/CorpusList";
import {Route, RouteComponentProps, withRouter} from "react-router-dom";
import {AutoCollapseSidebar} from "../../components/AutoCollapseSidebar/AutoCollapseSidebar";
import {SidebarHeader, Menu, MenuItem, SubMenu} from 'react-pro-sidebar';
import CorpusDetails from "./details/CorpusDetails";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlasses} from "@fortawesome/free-solid-svg-icons";
import {Link} from 'react-router-dom';

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
class CorpusSettings extends Component<Props, State> {
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
            <React.Fragment>
                <nav id="leftNav">
                    <AutoCollapseSidebar animateTransition={true}>
                        <SidebarHeader>
                            <h2 className="h5 p-3 text-center font-weight-light">Corpora</h2>
                        </SidebarHeader>
                        <Menu iconShape="circle">
                            <MenuItem icon={<FontAwesomeIcon icon={faGlasses}/>}>Overview <Link
                                to={`${match.path}`}/></MenuItem>
                        </Menu>
                    </AutoCollapseSidebar>
                </nav>
                <section id="content">
                    <Route exact={true} path={`${match.path}`}>
                        <CorporaList/>
                    </Route>
                    <Route exact={true} path={`${match.path}/edit`}>
                        <CorpusDetails/>
                    </Route>
                </section>
            </React.Fragment>
        );
    }
}

export default withRouter(CorpusSettings);
