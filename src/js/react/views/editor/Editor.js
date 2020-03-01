import React, {Component} from "react";
import FetchPending from "../../components/FetchPending";
import fetchStatusType from "../../../redux/actions/FetchStatusTypes";
import ListGroup from "react-bootstrap/ListGroup";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../redux/actions/ActionCreators";
import connect from "react-redux/es/connect/connect";
import AnnotationEditorCodeMirror from "../../components/AnnotationEditorCodeMirror";
import SearchableDropdown from "../../components/searchableDropdown/SearchableDropdown";
import Alert from "react-bootstrap/Alert";

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
                                       active={this.props.selectedCorpus.values.c_id === corpus.c_id}
                                       onClick={() => {
                                           this.props.setEditableCorpus(corpus);
                                           this.props.sele
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
        return this.props.selectedCorpus.values.c_id <= 0;
    }

    _isAnnotationSetValid() {
        return this.props.selectedCorpus.annotationSets.items.length > 0
            && this.props.selectedCorpus.annotationSets.items.filter(x => x.s_id === this.props.selectedAnnotationSet.values.s_id).length > 0
    }

    _isDocumentValid() {
        return this.props.selectedCorpus.documents.items.length > 0 && this.props.selectedDocument.item && this.props.selectedDocument.item.d_id >= 0;
    }

    _tagsBySet() {
        let tags = this.props.selectedDocument.tags.items;
        let annotations = new Set(this.props.selectedAnnotationSet.annotations.items.map(x => x.a_id));
        return tags.filter(x => annotations.has(x.a_id))
    }

    _renderEditor() {
        if (!this._isAnnotationSetValid() || !this._isDocumentValid())
            return (
                <div className="d-flex w-100 h-100 justify-content-center align-items-center">
                    <h4 className="text-center">Please select your options.</h4>
                </div>
            )
        return (
            <AnnotationEditorCodeMirror
                annotations={this.props.selectedAnnotationSet.annotations.items}
                tags={this._tagsBySet()}
                onSaveTag={(tag) => this._saveTag(tag)}
                onDeleteTag={(tag) => this._deleteTag(tag)}
                document={this.props.selectedDocument.item}/>)
    }

    render() {
        return (
            <React.Fragment>
                <div className="editorNav">
                    <div style={{minWidth: "300px"}}/>

                    <h6>Select Corpus</h6>
                    <FetchPending isPending={this.props.corpora.isFetching}
                                  success={this.props.corpora.status === fetchStatusType.success}
                                  inheritChildrenHeight={false}
                                  silent={false}
                    >
                        <SearchableDropdown buttonText="No Corpus selected"
                                            toggleId="corpusToggle"
                                            onChange={(corpus) => {
                                                this.props.fetchCorpusDocuments(corpus.c_id);
                                                this.props.setEditableCorpus(corpus);
                                            }}
                                            optionKey="c_id"
                                            options={this.props.corpora.items}
                                            initOption={this.props.corpora.items.length === 0 ? undefined : this.props.corpora.items[0]}
                                            label="name"
                                            searchPlaceholder={"Find Annotation Set..."}/>


                        <React.Fragment>
                            <hr/>
                            <h6>Select Annotation Set</h6>
                            <FetchPending isPending={this.props.selectedCorpus.annotationSets.isFetching}
                                          success={this.props.selectedCorpus.annotationSets.status === fetchStatusType.success}
                                          inheritChildrenHeight={false}
                                          silent={false}
                            >
                                <SearchableDropdown buttonText="No Annotation Set selected"
                                                    toggleId="annotationSetId"
                                                    onChange={(annotationSet) => {
                                                        this.props.setActiveAnnotationSet(annotationSet)
                                                    }}
                                                    optionKey="s_id"
                                                    options={this.props.selectedCorpus.annotationSets.items}
                                                    initOption={this.props.selectedCorpus.annotationSets.items.length === 0 ? undefined : this.props.selectedCorpus.annotationSets.items[0]}
                                                    label="name"
                                                    searchPlaceholder={"Find Corpus..."}/>
                            </FetchPending>
                        </React.Fragment>
                        {!this._isSelectedCorpusNew() &&
                        <FetchPending isPending={this.props.selectedCorpus.documents.isFetching}
                                      success={this.props.selectedCorpus.documents.status === fetchStatusType.success}
                                      inheritChildrenHeight={false}
                                      silent={false}
                        >
                            <React.Fragment>
                                <hr/>
                                <h6>Select Document</h6>
                                <SearchableDropdown buttonText="No Document selected"
                                                    toggleId="documentToggle"
                                                    onChange={(document) => this.props.fetchCorpusDocument(document.d_id, true)}
                                                    optionKey="d_id"
                                                    disabled={this._isSelectedCorpusNew()}
                                                    options={this.props.selectedCorpus.documents.items}
                                                    initOption={this.props.selectedCorpus.documents.items.length === 0 ? undefined : this.props.selectedCorpus.documents.items[0]}
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
                                </ListGroup></React.Fragment>
                        </FetchPending>
                        }
                    </FetchPending>
                </div>

                <FetchPending
                    isPending={this.props.corpora.isFetching
                    || this.props.selectedDocument.isFetching
                    || this.props.selectedAnnotationSet.annotations.isFetching
                    || this.props.selectedDocument.tags.isFetching}
                    success={this.props.corpora.status === fetchStatusType.success
                    && this.props.selectedDocument.status === fetchStatusType.success
                    && this.props.selectedAnnotationSet.annotations.status === fetchStatusType.success
                    && this.props.selectedDocument.tags.status === fetchStatusType.success}
                >
                    <div className="editor">
                        {this._renderEditor()}
                    </div>
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
