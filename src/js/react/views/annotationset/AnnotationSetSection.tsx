import React, {Component} from "react";
import AnnotationSetList from "./AnnotationSetList";
import {Route, RouteComponentProps, withRouter} from "react-router-dom";
import EditAnnotationSet from "./data/EditAnnotationSet";
import NewAnnotationSet from "./data/NewAnnotationSet";
import FormAnnotationSet from "./data/FormAnnotationSet";

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
class AnnotationSetSection extends Component<Props, State> {
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
                {/*<nav id="leftNav">*/}
                {/*    <AutoCollapseSidebar animateTransition={true}>*/}
                {/*        <SidebarHeader>*/}
                {/*            <h2 className="h5 p-3 text-center font-weight-light">Annotation Sets</h2>*/}
                {/*        </SidebarHeader>*/}
                {/*        <Menu iconShape="circle">*/}
                {/*            <MenuItem icon={<FontAwesomeIcon icon={faGlasses}/>}>Overview <Link*/}
                {/*                to={`${match.path}`}/></MenuItem>*/}
                {/*        </Menu>*/}
                {/*    </AutoCollapseSidebar>*/}
                {/*</nav>*/}
                <section id="content">
                    <Route exact={true} path={`${match.path}`}>
                        <AnnotationSetList/>
                    </Route>
                    <Route exact={true} path={`${match.path}/edit`}>
                        <FormAnnotationSet />
                    </Route>
                    <Route exact={true} path={`${match.path}/new`}>
                        <FormAnnotationSet new={true}/>
                    </Route>
                </section>
            </React.Fragment>
        );
    }
}

export default withRouter(AnnotationSetSection);
