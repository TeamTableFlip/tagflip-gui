import React, {Component} from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
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
                return <ListGroup.Item action key={document.d_id}
                                       active={this.props.selectedDocument.item && this.props.selectedDocument.item.d_id === document.d_id}
                                       onClick={() => this.props.fetchCorpusDocument(document.d_id, true)}>
                    {document.filename}
                </ListGroup.Item>
            });
    }

    _saveTag(tag) {
        this.props.saveTagForActiveDocument(tag);
    }

    _deleteTag(tag) {
        this.props.deleteTagForActiveDocument(tag);
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
                        <Form>
                            <InputGroup className="mb-3">
                                <Form.Control type="text" placeholder="Search Corpus..."
                                              onChange={e => this.setState({searchCorpusSubstring: e.target.value})}
                                              value={this.state.searchCorpusSubstring}/>
                            </InputGroup>
                        </Form>
                        <ListGroup>
                            {this._renderCorpora()}
                        </ListGroup>
                    </FetchPending>
                    <hr/>

                    <div>Select Document</div>
                    <FetchPending isPending={this.props.selectedCorpus.documents.isFetching}
                                  success={this.props.selectedCorpus.documents.status === fetchStatusType.success}
                                  inheritChildrenHeight={false}
                    >
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
                    </FetchPending>
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
