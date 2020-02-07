import React, {Component} from "react";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Nav from "react-bootstrap/Nav";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import CorporaList from "./corpus/CorpusList";
import CorpusDetails from "./corpus/CorpusDetails";
import {Redirect, Route, withRouter} from "react-router-dom";
import AnnotationSetList from "./annotationset/AnnotationSetList";
import AnnotationSetDetails from "./annotationset/AnnotationSetDetails";

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeLink: "0"
        }
    }

    render() {
        const {match} = this.props
        return (
            <React.Fragment>
                <div className="leftNav">
                    <Nav variant="pills" activeKey={this.state.activeLink} className="mt-4 flex-column"
                         onSelect={(k) => this.setState({activeLink: k})}>
                        <Nav.Link onSelect={() => this.props.history.push(`${match.path}/corpus`)}
                                  eventKey="0">Corpora</Nav.Link>
                        <Nav.Link onSelect={() => this.props.history.push(`${match.path}/annotationset`)} eventKey="1">Annotation
                            Sets</Nav.Link>
                    </Nav>
                </div>
                <div className="content">
                    <Route exact={true} path={`${match.path}/corpus`}>
                        <CorporaList/>
                    </Route>
                    <Route path={`${match.path}/corpus/edit`}>
                        <CorpusDetails/>
                    </Route>
                    <Route exact={true} path={`${match.path}/annotationset`}>
                        <AnnotationSetList/>
                    </Route>
                    <Route path={`${match.path}/annotationset/edit`}>
                        <AnnotationSetDetails/>
                    </Route>
                    <Route exact={true} path={`${match.path}`} render={props => {
                        this.setState({activeLink: "0"})
                        return (<Redirect to={`${match.path}/corpus`}/>)
                    }}/>


                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(Settings);