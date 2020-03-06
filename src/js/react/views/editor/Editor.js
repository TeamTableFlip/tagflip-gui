import React, {Component} from "react";
import FetchPending from "../../components/FetchPending";
import fetchStatusType from "../../../redux/actions/FetchStatusTypes";
import ListGroup from "react-bootstrap/ListGroup";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../redux/actions/ActionCreators";
import connect from "react-redux/es/connect/connect";
import AnnotationEditorCodeMirror from "../../components/AnnotationEditorCodeMirror";
import SearchableDropdown from "../../components/searchableDropdown/SearchableDropdown";

/**
 * The Editor view aws a React Component.
 */
class Editor extends Component {
    /**
     * Create a new Editor component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.state = {
            searchCorpusSubstring: "",
            searchDocumentSubstring: "",
        }
    }

    /**
     * React lifecycle method. Fetches all corpora.
     */
    componentDidMount() {
        this.props.fetchCorpora();
    }

    /**
     * Get the Documents of the selected Corpus as ListGroupItems to be rendered.
     * @returns {*[]} The documents to be rendered as ListGroupItems.
     * @private
     */
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

    /**
     * Persist a tag in the active document.
     * @param tag The tag to be saved.
     * @private
     */
    _saveTag(tag) {
        this.props.saveTagForActiveDocument(tag);
    }

    /**
     * Delete a tag from the active document.
     * @param tag The tag to be deleted.
     * @private
     */
    _deleteTag(tag) {
        this.props.deleteTagForActiveDocument(tag);
    }

    /**
     * Determines whether the selected corpus is new (non-existent) or not.
     * @returns {boolean} True if the selected corpus is new, otherwise false.
     * @private
     */
    _isSelectedCorpusNew() {
        return this.props.selectedCorpus.values.c_id <= 0;
    }

    /**
     * Determine whether the selected corpus has an annotation set assigned.
     * @returns {boolean} True if there is at least one AnnotationSet in the selected Corpus, optherwise false.
     * @private
     */
    _hasCorpusAnnotationSets() {
        return this.props.selectedCorpus.annotationSets.items.length > 0;
    }

    /**
     * Determines whether the selected annotation set is valid or not.
     * @returns {boolean} True if the selected annotation set is valid, otherwise false.
     * @private
     */
    _isAnnotationSetValid() {
        return this._hasCorpusAnnotationSets()
            && this.props.selectedCorpus.annotationSets.items.filter(x => x.s_id === this.props.selectedAnnotationSet.values.s_id).length > 0;
    }

    /**
     * Determines whether the selected document is valid or not.
     * @returns {boolean|null}
     *          True if the selected document exists and is not new.
     *          False if the selected document exists, but is a new one.
     *          null if the selected document is invalid.
     * @private
     */
    _isDocumentValid() {
        return this.props.selectedCorpus.documents.items.length > 0 && this.props.selectedDocument.item && this.props.selectedDocument.item.d_id >= 0;
    }

    /**
     * Get all tags from the selected annotation set.
     * @returns {*[]} A list of all tags from the selected annotation set.
     * @private
     */
    _tagsBySet() {
        let tags = this.props.selectedDocument.tags.items;
        let annotations = new Set(this.props.selectedAnnotationSet.annotations.items.map(x => x.a_id));
        return tags.filter(x => annotations.has(x.a_id));
    }

    /**
     * The editor view to be rendered.
     * @returns {*} A div if the selected AnnotationSet or Document is invalid; otherwise the Editor for tagging.
     * @private
     */
    _renderEditor() {
        if (!this._isAnnotationSetValid() || !this._isDocumentValid())
            return (
                <div className="d-flex w-100 h-100 justify-content-center align-items-center">
                    <h4 className="text-center">Please select your options.</h4>
                </div>
            );
        return (
            <AnnotationEditorCodeMirror
                annotations={this.props.selectedAnnotationSet.annotations.items}
                tags={this._tagsBySet()}
                onSaveTag={(tag) => this._saveTag(tag)}
                onDeleteTag={(tag) => this._deleteTag(tag)}
                document={this.props.selectedDocument.item}/>);
    }

    /**
     * Renders the Editor view for tagging Documents, and a side nav containing a Corpus-, AnnotationSet- and Document-Selection.
     * @returns {*} The view to be rendered.
     */
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
                                                this.props.setEditableCorpus(corpus);
                                                this.props.fetchCorpusDocuments(corpus.c_id);
                                            }}
                                            optionKey="c_id"
                                            options={this.props.corpora.items}
                                            selected={!this._isSelectedCorpusNew() ? this.props.selectedCorpus.values : (this.props.corpora.items.length === 0 ? undefined : this.props.corpora.items[0])}
                                            label="name"
                                            searchPlaceholder={"Find Corpus..."}/>
                    </FetchPending>

                    {!this._isSelectedCorpusNew() && !this._hasCorpusAnnotationSets() &&
                    <React.Fragment>
                        <hr/>
                        <p>The selected Corpus has no Annotation Set assigned.</p>
                        <p>Please go to the Settings to add an Annotation Set to the selected Corpus.</p>
                    </React.Fragment>
                    }

                    {!this._isSelectedCorpusNew() && this._hasCorpusAnnotationSets() &&
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
                                                selected={this.props.selectedAnnotationSet.values.s_id > 0
                                                && this.props.selectedCorpus.annotationSets.items.filter(x => x.s_id === this.props.selectedAnnotationSet.values.s_id).length > 0
                                                    ? this.props.selectedAnnotationSet.values
                                                    : (this.props.selectedCorpus.annotationSets.items.length === 0 ? undefined : this.props.selectedCorpus.annotationSets.items[0])}
                                                label="name"
                                                searchPlaceholder={"Find Annotation Set..."}/>
                        </FetchPending>

                        <FetchPending isPending={this.props.selectedCorpus.documents.isFetching}
                                      success={this.props.selectedCorpus.documents.status === fetchStatusType.success}
                                      inheritChildrenHeight={false}
                                      silent={false}
                        >
                            <hr/>
                            <h6>Select Document</h6>
                            <SearchableDropdown buttonText="No Document selected"
                                                toggleId="documentToggle"
                                                onChange={(document) => this.props.fetchCorpusDocument(document.d_id, true)}
                                                optionKey="d_id"
                                                disabled={this._isSelectedCorpusNew()}
                                                options={this.props.selectedCorpus.documents.items}
                                                selected={
                                                    this.props.selectedDocument.item &&
                                                    this.props.selectedDocument.item.d_id > 0
                                                    && this.props.selectedCorpus.documents.items.filter(x => x.d_id === this.props.selectedDocument.item.d_id).length > 0
                                                        ? this.props.selectedDocument.item
                                                        : (this.props.selectedCorpus.documents.items.length === 0 ? undefined : this.props.selectedCorpus.documents.items[0])
                                                }
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
                            </ListGroup>
                        </FetchPending>
                    </React.Fragment>
                    }
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
