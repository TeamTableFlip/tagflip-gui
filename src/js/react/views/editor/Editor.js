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
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Pagination from 'react-bootstrap/Pagination'
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../redux/actions/ActionCreators";
import connect from "react-redux/es/connect/connect";
import AnnotationEditorCodeMirror from "../../components/AnnotationEditorCodeMirror";
import FetchPending from "../../components/FetchPending";
import fetchStatusType from "../../../redux/actions/FetchStatusTypes";

class Editor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchCorpusSubstring: "",
            searchDocumentSubstring: ""
        }
    }

    componentDidMount() {
        this.props.fetchCorpora();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedCorpus.didInvalidate && !this.props.selectedCorpus.didInvalidate) {
            if (this.props.selectedCorpus.annotationSets && this.props.selectedCorpus.annotationSets.items) { // TODO : THIS IS TEMPORARY
                this.props.setActiveAnnotationSet(this.props.selectedCorpus.annotationSets.items[0])
            }
        }
    }

    _renderCorpora() {
        return this.props.corpora.items
            .filter(corpus => corpus.name.toLowerCase().includes(this.state.searchCorpusSubstring.toLowerCase()))
            .map(corpus => {
                return <ListGroup.Item action key={corpus.c_id}
                                       active={this.props.selectedCorpus.values.c_id === corpus.c_id}
                                       onClick={() => {
                                           this.props.setEditableCorpus(corpus);
                                       }}>
                    {corpus.name}
                </ListGroup.Item>
            });
    }

    _renderDocuments() {
        return this.props.selectedCorpus.documents.items
            .filter(document => document.filename.toLowerCase().includes(this.state.searchDocumentSubstring.toLowerCase()))
            .map(document => {
                let filenamePath = document.filename.split('/');
                let documentName = document.d_id + ': ' + filenamePath[filenamePath.length - 1];
                return <ListGroup.Item action key={document.d_id}
                                       active={this.props.selectedDocument.item && this.props.selectedDocument.item.d_id === document.d_id}
                                       onClick={() => this.props.fetchCorpusDocument(document.d_id, true)}>
                    {documentName}
                </ListGroup.Item>
            });
    }

    _saveTag(tag) {
        this.props.saveTagForActiveDocument(tag);
    }

    _deleteTag(tag) {
        this.props.deleteTagForActiveDocument(tag);
    }

    _isSelectedCorpusNew() {
        return this.props.selectedCorpus.data.values.c_id <= 0;
    }

    _isSelectedDocumentNew() {
        return this.props.selectedDocument.data.values.d_id <= 0;
    }

    render() {
        return (
            <React.Fragment>
                <div className="editorNav">
                    <div style={{minWidth: "300px"}}/>

                    <div>Select Corpus</div>
                    <FetchPending isPending={this.props.selectedCorpus.documents.isFetching}
                                  success={this.props.selectedCorpus.documents.status === fetchStatusType.success}
                                  inheritChildrenHeight={false}
                                  silent={true}
                    >
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
                                            searchPlaceholder={"Find Corpus..."}/>
                    </FetchPending>
                    {!this._isSelectedCorpusNew() &&
                    <FetchPending isPending={this.props.selectedCorpus.documents.isFetching}
                                  success={this.props.selectedCorpus.documents.status === fetchStatusType.success}
                                  inheritChildrenHeight={false}
                    >
                        (
                        <div>
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
                                                    return document.d_id + ': ' + filenamePath[filenamePath.length - 1];
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
                        )
                    </FetchPending>
                    }
                </div>
                <FetchPending isPending={this.props.corpora.isFetching}
                              success={this.props.corpora.status === fetchStatusType.success}>
                    <FetchPending isPending={this.props.selectedDocument.isFetching}
                                  success={this.props.selectedDocument.status === fetchStatusType.success}>
                        <FetchPending isPending={this.props.selectedAnnotationSet.annotations.isFetching}
                                      success={this.props.selectedAnnotationSet.annotations.status === fetchStatusType.success}>
                            <FetchPending isPending={this.props.selectedDocument.tags.isFetching}
                                          success={this.props.selectedDocument.tags.status === fetchStatusType.success}>
                                <div className="editor">
                                    <AnnotationEditorCodeMirror
                                        annotations={this.props.selectedAnnotationSet.annotations.items}
                                        tags={this.props.selectedDocument.tags.items}
                                        onSaveTag={(tag) => this._saveTag(tag)}
                                        onDeleteTag={(tag) => this._deleteTag(tag)}
                                        document={this.props.selectedDocument.item}/>
                                </div>
                            </FetchPending>
                        </FetchPending>
                    </FetchPending>
                </FetchPending>
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
        selectedCorpus: state.editableCorpus,
        selectedDocument: state.editableCorpus.activeDocument,
        selectedAnnotationSet: state.activeAnnotationSet
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
