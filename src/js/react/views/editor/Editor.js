import React, {Component} from "react";
import {Redirect, Route, withRouter} from "react-router-dom";
import AnnotationEditor from "../../components/AnnotationEditor";
import DropdownButton from "react-bootstrap/DropdownButton";
import DropdownItem from "react-bootstrap/DropdownItem";
import FetchPending from "../../components/FetchPending";
import fetchStatusType from "../../../redux/actions/FetchStatusTypes";


class Configuration extends Component {

    constructor(props) {
        super(props);
    }

    // componentDidMount() {
    //     this.props.fetchDocument();
    // }

    render() {
        return (
            <React.Fragment>
                <div className="editorNav">
                    <div>currentCorpus: bla</div>
                    <div>currentDocument: bla</div>
                    <div>prev, next</div>

                </div>

                <AnnotationEditor />
            </React.Fragment>
        );
    }
}

export default Configuration;
