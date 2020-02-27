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
import {Typeahead, Menu, MenuItem} from "react-bootstrap-typeahead";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../redux/actions/ActionCreators";
import connect from "react-redux/es/connect/connect";
import SearchableDropdown from "../../components/searchableDropdown/SearchableDropdown";

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

    _renderCorpora() {
        return this.props.corpora.items
            .filter(corpus => corpus.name.toLowerCase().includes(this.state.searchCorpusSubstring.toLowerCase()))
            .map(corpus => {
                return <ListGroup.Item action key={corpus.c_id}
                                       active={this.props.selectedCorpus.data.values.c_id === corpus.c_id}
                                       onClick={() => {
                                           this.props.fetchCorpusDocuments(corpus.c_id);
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
                let documentName = document.d_id + ': ' + filenamePath[filenamePath.length-1];
                return <ListGroup.Item action key={document.d_id}
                                       active={this.props.selectedDocument.data.values.d_id === document.d_id}
                                       onClick={() => this.props.setTagableDocument(document)}>
                    {documentName}
                </ListGroup.Item>
            });
    }

    render() {
        return (
            <React.Fragment>
                <div className="editorNav">
                    <div style={{minWidth: "300px"}} />

                    {/*<div>Select Corpus</div>*/}
                    <SearchableDropdown buttonText="Select Corpus"
                                        onChange={(corpus) => {
                                            this.props.fetchCorpusDocuments(corpus.c_id);
                                            this.props.setEditableCorpus(corpus);
                                        }}
                                        optionKey="c_id"
                                        // filter={(corpus, searchSubstring) => {
                                        //     return corpus.name.toLowerCase().includes(searchSubstring.toLowerCase())
                                        // }}
                                        options={this.props.corpora.items}
                                        label="name"
                                        searchPlaceholder={"Filter corpora..."}
                    />
                    {/*<Form>*/}
                        {/*<InputGroup className="mb-3">*/}
                            {/*<Form.Control type="text" placeholder="Search Corpus..."*/}
                                          {/*onChange={e => this.setState({searchCorpusSubstring: e.target.value})}*/}
                                          {/*value={this.state.searchCorpusSubstring}/>*/}
                        {/*</InputGroup>*/}
                    {/*</Form>*/}
                    {/*<ListGroup>*/}
                        {/*{this._renderCorpora()}*/}
                    {/*</ListGroup>*/}

                    <hr/>

                    <div>Select Document</div>
                    <Form>
                        <InputGroup className="mb-3">
                            <Form.Control type="text" placeholder="Search Document..."
                                          onChange={e => this.setState({searchDocumentSubstring: e.target.value})}
                                          value={this.state.searchDocumentSubstring}/>
                        </InputGroup>
                    </Form>
                    <ListGroup>
                        {this._renderDocuments()}
                    </ListGroup>
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
