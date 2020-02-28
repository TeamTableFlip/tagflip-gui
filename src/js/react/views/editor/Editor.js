import React, {Component} from "react";
import {Redirect, Route, withRouter} from "react-router-dom";
import AnnotationEditor from "../../components/AnnotationEditor";
import DropdownButton from "react-bootstrap/DropdownButton";
import DropdownItem from "react-bootstrap/DropdownItem";
import FetchPending from "../../components/FetchPending";
import fetchStatusType from "../../../redux/actions/FetchStatusTypes";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faTimes} from "@fortawesome/free-solid-svg-icons";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Pagination from 'react-bootstrap/Pagination'
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../redux/actions/ActionCreators";
import connect from "react-redux/es/connect/connect";
import SearchableDropdown from "../../components/searchableDropdown/SearchableDropdown";

class Editor extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchCorpora();
    }

    _renderDocuments() {
        return this.props.selectedCorpus.documents.items
            .map(document => {
                let filenamePath = document.filename.split('/');
                let documentName = document.d_id + ': ' + filenamePath[filenamePath.length-1];
                return <ListGroup.Item action key={document.d_id}
                                       active={this.props.selectedDocument.data.values.d_id === document.d_id}
                                       onClick={() => this.props.setTagableDocument(document)}>
                    {documentName}
                </ListGroup.Item>
            });
    }

    _isSelectedCorpusNew() {
        return this.props.selectedCorpus.data.values.c_id <= 0;
    }

    _isSelectedDocumentNew() {
        return this.props.selectedDocument.data.values.d_id <= 0;
    }

    render() {
        // TODO: Synchronize documents list and selected item of searchable dropdown
        return (
            <React.Fragment>
                <div className="editorNav">
                    <div style={{minWidth: "300px"}} />

                    <div>Select Corpus</div>
                    <SearchableDropdown buttonText="No Corpus selected"
                                        toggleId="corpusToggle"
                                        onChange={(corpus) => {
                                            this.props.fetchCorpusDocuments(corpus.c_id);
                                            this.props.setEditableCorpus(corpus);
                                        }}
                                        optionKey="c_id"
                                        options={this.props.corpora.items}
                                        initOption={this._isSelectedCorpusNew() ? undefined : this.props.selectedCorpus.data.values}
                                        label="name"
                                        searchPlaceholder={"Find Corpus..."} />
                    { !this._isSelectedCorpusNew() && <div>
                        <hr/>
                        <div>Select Document</div>
                        <SearchableDropdown buttonText="No Document selected"
                                            toggleId="documentToggle"
                                            onChange={(document) => this.props.setTagableDocument(document)}
                                            optionKey="d_id"
                                            disabled={this._isSelectedCorpusNew()}
                                            options={this.props.selectedCorpus.documents.items}
                                            initOption={this._isSelectedDocumentNew() ? undefined : this.props.selectedDocument.data.values}
                                            getText={document => {
                                                let filenamePath = document.filename.split('/');
                                                return document.d_id + ': ' + filenamePath[filenamePath.length-1];
                                            }}
                                            filter={(document, searchSubstring) => {
                                                let matchFilename = document.filename.toLowerCase().includes(searchSubstring.toLowerCase());
                                                let matchId = document.d_id.toString().toLowerCase().includes(searchSubstring.toLowerCase());
                                                return matchFilename || matchId;
                                            }}
                                            searchPlaceholder={"Find Document..."}
                        />
                        <ListGroup style={{marginTop: "10px"}}>
                            {this._renderDocuments()}
                        </ListGroup></div>
                    }
                </div>

                <AnnotationEditor />
            </React.Fragment>
        );
    }
}

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        corpora: state.corpora,
        emptyCorpus: state.emptyCorpus,
        selectedCorpus: state.editableCorpus,
        selectedDocument: state.tagableDocument,
        emptyDocument: state.emptyDocument
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
