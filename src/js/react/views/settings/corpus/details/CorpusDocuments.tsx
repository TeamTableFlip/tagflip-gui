import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import FileUpload from "../../../../components/fileUpload/FileUpload";
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../../../../redux/actions/ActionCreators';
import fetchStatusType from "../../../../../redux/actions/FetchStatusTypes";
import FetchPending from "../../../../components/FetchPending";
import { Alert } from "react-bootstrap";
import ShowMoreText from 'react-show-more-text';
import ConfirmationDialog from "../../../../components/dialogs/ConfirmationDialog";
import ShowDocument from "../../../../components/dialogs/ShowDocument";

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        corpus: state.editableCorpus,
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

type Props = PropsFromRedux & {
}

interface State {
    uploadWarningShowMore: boolean;
    documentIdToBeDeleted: number;
    documentToBeShown: number;
}

const initialState = {
    uploadWarningShowMore: false,
    documentIdToBeDeleted: undefined,
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
        let renderDocumentTableData = () => {
            return this.props.corpus.documents.items.map(document => {
                return (<tr key={document.d_id}>
                    <td scope="row">{document.d_id}</td>
                    <td>{document.filename}</td>
                    <td>
                        <div className="float-right">
                            <Button size="sm"
                                onClick={() => {
                                    this.props.fetchCorpusDocument(document.d_id);
                                    this.setState({ documentToBeShown: document.d_id });
                                }}><FontAwesomeIcon
                                    icon={faSearch} /></Button>
                            <Button size="sm" variant="danger"
                                onClick={() => this.setState({ documentIdToBeDeleted: document.d_id })}
                            ><FontAwesomeIcon
                                    icon={faTrash} /></Button>
                            <ConfirmationDialog
                                acceptVariant="danger"
                                show={this.state.documentIdToBeDeleted === document.d_id}
                                message={"Are you sure you want to delete the Corpus '" + document.filename + "'?"}
                                onAccept={() => {
                                    this.props.deleteCorpusDocument(document.d_id);
                                    this.setState({ documentIdToBeDeleted: undefined });
                                }}
                                onCancel={() => {
                                    this.setState({ documentIdToBeDeleted: undefined });
                                }}
                                acceptText="Delete" />
                            <ShowDocument
                                show={this.state.documentToBeShown > 0}
                                onHide={() => this.setState({ documentToBeShown: undefined })}
                                isLoading={this.props.corpus.activeDocument.isFetching}
                                success={this.props.corpus.activeDocument.status === fetchStatusType.success}
                                title={this.props.corpus.activeDocument.item ? this.props.corpus.activeDocument.item.filename : ""}
                                text={this.props.corpus.activeDocument.item ? this.props.corpus.activeDocument.item.text : ""}
                            />
                        </div>
                    </td>
                </tr>)
            })
        };

        return (
            <div className="table-responsive">
                <FetchPending isPending={this.props.corpus.documents.isFetching}
                    success={this.props.corpus.documents.status !== fetchStatusType.error}
                    retryCallback={() => this.props.fetchCorpusDocuments(this.props.corpus.values.c_id)}
                >
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Datei</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderDocumentTableData()}
                        </tbody>
                    </table>
                </FetchPending>
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
                <h3>Documents</h3>
                <Card className="mt-3">
                    <Card.Body>
                        <Card.Title>Upload</Card.Title>
                        <FetchPending isPending={this.props.corpus.documents.isFetching}
                            success={this.props.corpus.documents.status !== fetchStatusType.error}
                        >
                            {
                                this.props.corpus.documents.status === fetchStatusType.warning &&
                                <Alert variant="warning" style={{ whiteSpace: "pre-wrap" }}>
                                    <ShowMoreText
                                        lines={5}
                                        more={<span className="ml-3">More ...</span>}
                                        less={<span className="ml-3">Less ...</span>}
                                        anchorClass=''
                                        onClick={() => this.setState({ uploadWarningShowMore: !this.state.uploadWarningShowMore })}
                                        expanded={false}
                                    >
                                        {this.props.corpus.documents.error}
                                    </ShowMoreText>
                                </Alert>
                            }
                            <FileUpload
                                isUploading={this.props.corpus.documents.isFetching}
                                onUpload={(files) => this.props.uploadCorpusDocuments(this.props.corpus.values.c_id, files)}
                                maxCount={50}
                                uploadText="Drop Text-Files or ZIP-Archive here... or just click..."
                                acceptMimeTypes='text/plain, application/zip,application/x-zip-compressed,multipart/x-zip"'
                            />
                        </FetchPending>
                    </Card.Body>
                    <Card.Body>
                        <Card.Title>Available: {this.props.corpus.documents.items.length}</Card.Title>
                        {this._renderDocuments()}
                    </Card.Body>
                </Card>
            </React.Fragment>
        );
    }
}

export default connector(CorpusDocuments);