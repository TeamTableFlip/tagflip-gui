import React, {Component} from "react";
import CorporaList from "../corpus/CorpusList";
import {Route, RouteComponentProps, withRouter} from "react-router-dom";
import FormCorpus from "./data/FormCorpus";
import DocumentAnnotationViewer from "./data/edit/DocumentAnnotationViewer";
import CorpusImport from "./CorpusImport";

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
class CorpusSection extends Component<Props, State> {
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
                {/*            <h2 className="h5 p-3 text-center font-weight-light">Corpora</h2>*/}
                {/*        </SidebarHeader>*/}
                {/*        <Menu iconShape="circle">*/}
                {/*            <MenuItem icon={<FontAwesomeIcon icon={faGlasses}/>}>Overview <Link*/}
                {/*                to={`${match.path}`}/></MenuItem>*/}
                {/*        </Menu>*/}
                {/*    </AutoCollapseSidebar>*/}
                {/*</nav>*/}
                <section id="content">
                    <Route exact={true} path={`${match.path}`}>
                        <CorporaList/>
                    </Route>
                    <Route exact={true} path={`${match.path}/import`}>
                        <CorpusImport/>
                    </Route>
                    <Route exact={true} path={`${match.path}/edit`}>
                        <FormCorpus/>
                    </Route>
                    <Route exact={true} path={`${match.path}/edit/document`}>
                        <DocumentAnnotationViewer />
                    </Route>
                    <Route exact={true} path={`${match.path}/new`}>
                        <FormCorpus new={true} />
                    </Route>
                </section>
            </React.Fragment>
        );
    }
}

export default withRouter(CorpusSection);
