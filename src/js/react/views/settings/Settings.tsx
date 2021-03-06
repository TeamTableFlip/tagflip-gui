import React, {Component} from "react";
import Nav from "react-bootstrap/Nav";
import CorporaList from "../corpus/CorpusList";
import EditCorpus from "../corpus/data/edit/EditCorpus";
// import CorpusImport from "../corpus/CorpusImport";
import {Redirect, Route, RouteComponentProps, withRouter} from "react-router-dom";
import AnnotationSetList from "../annotationset/AnnotationSetList";
import EditAnnotationSet from "../annotationset/data/EditAnnotationSet";
import NewAnnotationSet from "../annotationset/data/NewAnnotationSet";

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
class Settings extends Component<Props, State> {
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
                <Nav id="leftNav" variant="pills" className="flex-column p-5" as={"nav"} activeKey={this.state.activeLink}
                     onSelect={(k) => this.setState({activeLink: k})}>
                    <Nav.Link onSelect={() => this.props.history.push(`${match.path}/corpus`)}
                              eventKey="0">Corpora</Nav.Link>
                    <Nav.Link onSelect={() => this.props.history.push(`${match.path}/annotationset`)} eventKey="1">Annotation
                        Sets</Nav.Link>
                </Nav>
                <section id="content">
                    <Route exact={true} path={`${match.path}/corpus`}>
                        <CorporaList/>
                    </Route>
                    <Route path={`${match.path}/corpus/edit`}>
                        <EditCorpus/>
                    </Route>
                    <Route path={`${match.path}/corpus/import`}>
                        {/*<CorpusImport/>*/}
                    </Route>
                    <Route exact={true} path={`${match.path}/annotationset`}>
                        <AnnotationSetList/>
                    </Route>
                    <Route path={`${match.path}/annotationset/edit`}>
                        <EditAnnotationSet />
                    </Route>
                    <Route exact={true} path={`${match.path}`} render={props => {
                        this.setState({activeLink: "0"});
                        return <Redirect to={`${match.path}/corpus`}/>
                    }}/>


                </section>
            </React.Fragment>
        );
    }
}

export default withRouter(Settings);
