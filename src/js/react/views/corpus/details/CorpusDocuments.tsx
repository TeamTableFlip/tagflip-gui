import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faTrash} from "@fortawesome/free-solid-svg-icons";
import FileUpload from "../../../components/FileUpload/FileUpload";
import {connect, ConnectedProps} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../redux/actions/ActionCreators';
import fetchStatusType from "../../../../redux/actions/FetchStatusTypes";
import FetchPending from "../../../components/FetchPending/FetchPending";
import {Alert} from "react-bootstrap";
import ShowMoreText from 'react-show-more-text';
import ConfirmationDialog from "../../../components/Dialog/ConfirmationDialog";
import ShowDocument from "../../../components/Dialog/ShowDocument";
import {toast} from "react-toastify";
import DataTable, {tagFlipTextFilter} from "../../../components/Dialog/DataTable";
import {OffsetLimitParam, SimpleQueryParam} from "../../../../backend/RequestBuilder";
import Document from "../../../../backend/model/Document";

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        corpus: state.activeCorpus,
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}

interface State {
    uploadWarningShowMore: boolean;
    documentToBeDeleted: Document;
    documentsToBeDeleted: Document[];
    documentToBeShown: Document;
}

const initialState = {
    uploadWarningShowMore: false,
    documentToBeDeleted: undefined,
    documentsToBeDeleted: undefined,
    documentToBeShown: undefined
}

/**
 * A React view for displaying all Documents of the Corpus. Provides the functionality to upload and remove Documents.
 */
class CorpusDocuments extends Component<Props, State> {
    /**
     * Create a new CorpusDocuments component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    /**
     * Get a Table containing all Documents assigned to the current Corpus.
     * @returns {*} The HTML-Table to be rendered, containing a list of all Documents of the Corpus.
     * @private
     */
    _renderDocuments() {
        let rowActions = (document: Document) => (
            <div className="float-right">
                <Button size="sm" onClick={() => {
                    this.props.fetchActiveCorpusDocument({
                        documentId: document.documentId,
                        withTags: false
                    });
                    this.setState({documentToBeShown: document});
                }}>
                    <FontAwesomeIcon icon={faSearch}/>
                </Button>
                <Button size="sm" variant="danger" onClick={() => this.setState({documentToBeDeleted: document})}>
                    <FontAwesomeIcon icon={faTrash}/>
                </Button>
            </div>
        )

        return (
            <div className="position-relative">
                <FetchPending isPending={this.props.corpus.documents.isFetching}
                              success={this.props.corpus.documents.status !== fetchStatusType.error}
                              subtle={true}
                              retryCallback={() => this.props.fetchActiveCorpus(this.props.corpus.values.corpusId)}
                >
                    <ShowDocument
                        show={this.state.documentToBeShown && this.state.documentToBeShown.documentId > 0}
                        onHide={() => this.setState({documentToBeShown: undefined})}
                        isLoading={this.props.corpus.activeDocument.isFetching}
                        success={this.props.corpus.activeDocument.status === fetchStatusType.success}
                        title={this.props.corpus.activeDocument.item ? this.props.corpus.activeDocument.item.filename : ""}
                        text={this.props.corpus.activeDocument.item ? this.props.corpus.activeDocument.item.content : ""}
                    />
                </FetchPending>
                <ConfirmationDialog
                    acceptVariant="danger"
                    show={this.state.documentToBeDeleted && this.state.documentToBeDeleted.documentId > 0}
                    message={"Are you sure you want to delete the Corpus '" + (this.state.documentToBeDeleted ? this.state.documentToBeDeleted.filename : "") + "'?"}
                    onAccept={() => {
                        this.props.deleteActiveCorpusDocument(this.state.documentToBeDeleted.documentId);
                        this.setState({documentToBeDeleted: undefined});
                    }}
                    onCancel={() => {
                        this.setState({documentToBeDeleted: undefined});
                    }}
                    acceptText="Delete"
                />
                <ConfirmationDialog
                    acceptVariant="danger"
                    show={this.state.documentsToBeDeleted && this.state.documentsToBeDeleted.length > 0}
                    message={"Are you sure you want to delete selected Documents'?"}
                    onAccept={() => {
                        this.state.documentsToBeDeleted.map(doc => this.props.deleteActiveCorpusDocument(doc.documentId));
                        this.setState({documentsToBeDeleted: undefined});
                    }}
                    onCancel={() => {
                        this.setState({documentsToBeDeleted: undefined});
                    }}
                    acceptText="Delete"
                />
                <DataTable<Document>
                    keyField="documentId"
                    columns={[{text: 'ID', dataField: 'documentId', sort: true, filter: tagFlipTextFilter()},
                        {text: 'Filename', dataField: 'filename', sort: true, filter: tagFlipTextFilter()}]}
                    rowActionComponent={(rowObject: Document) => rowActions(rowObject)}
                    tableActionComponent={(selectedObjects: Document[]) => (
                        <Button size="sm" variant="outline-danger" disabled={selectedObjects.length === 0}
                                onClick={() => this.setState({documentsToBeDeleted: selectedObjects})}>
                            <FontAwesomeIcon icon={faTrash}/> Delete
                        </Button>)
                    }
                    totalSize={this.props.corpus.documents.totalCount}
                    data={this.props.corpus.documents.items}
                    multiSelect={true}
                    onRequestData={(offset, limit, sortField, sortOrder, searchFilter) => {
                        let queryParams = OffsetLimitParam.of(offset, limit)
                        if (sortField)
                            queryParams.push(SimpleQueryParam.of("sortField", sortField))
                        if (sortOrder)
                            queryParams.push(SimpleQueryParam.of("sortOrder", sortOrder))
                        if (searchFilter && searchFilter.length > 0)
                            queryParams.push(SimpleQueryParam.of("searchFilter", JSON.stringify(searchFilter)))
                        this.props.fetchActiveCorpusDocuments(queryParams)
                    }}
                />
            </div>
        )
    }

    /**
     * Render the CorpusDocuments component.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <React.Fragment>
                <Card className="mt-3">
                    <Card.Body>
                        <Card.Title>Document Upload</Card.Title>
                        {
                            this.props.corpus.documents.status === fetchStatusType.warning &&
                            <Alert variant="warning" style={{whiteSpace: "pre-wrap"}}>
                                <ShowMoreText
                                    lines={5}
                                    more={<span className="ml-3">More ...</span>}
                                    less={<span className="ml-3">Less ...</span>}
                                    anchorClass=''
                                    onClick={() => this.setState({uploadWarningShowMore: !this.state.uploadWarningShowMore})}
                                    expanded={false}
                                >
                                    {this.props.corpus.documents.error}
                                </ShowMoreText>
                            </Alert>
                        }
                        <FileUpload
                            isUploading={this.props.corpus.documents.isFetching}
                            onUpload={(files) => {
                                files.forEach(f => this.props.uploadActiveCorpusDocuments([f]))
                            }}
                            maxCount={20}
                            onTooManyFiles={(current: number, max: number) => toast.error("Cannot process more than " + max + " files at once. ZIP files first.")}
                            onTypeMismatch={(acceptableTypes: string) => toast.error("Given type of file is not suppored. Choose one of: " + acceptableTypes)}
                            uploadText="Drop Text-Files or ZIP-Archive here... or just click..."
                            acceptMimeTypes='text/plain, application/zip,application/x-zip-compressed,multipart/x-zip"'
                        />
                    </Card.Body>
                    <Card.Body>
                        {this._renderDocuments()}
                    </Card.Body>
                </Card>
            </React.Fragment>
        );
    }
}

export default connector(CorpusDocuments);
