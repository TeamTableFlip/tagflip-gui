import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faTrash} from "@fortawesome/free-solid-svg-icons";
import FileUpload from "../../../../components/fileUpload/FileUpload";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../../redux/actions/ActionCreators';
import fetchStatusType from "../../../../../redux/actions/FetchStatusTypes";
import FetchPending from "../../../../components/FetchPending";
import {Alert} from "react-bootstrap";
import ShowMoreText from 'react-show-more-text';


class CorpusDocuments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploadWarningShowMore: false
        }
    }

    componentDidMount() {
        this.props.reloadCorpus();
    }

    _renderDocuments() {
        let renderDocumentTableData = () => {
            return this.props.corpus.documents.items.map(document => {
                return <tr key={document.d_id}>
                    <td scope="row">{document.d_id}</td>
                    <td>{document.filename}</td>
                    <td>
                        <div className="float-right">
                            <Button size="sm"><FontAwesomeIcon
                                icon={faSearch}/></Button>
                            <Button size="sm" variant="danger"><FontAwesomeIcon
                                icon={faTrash}/></Button>
                        </div>
                    </td>
                </tr>
            })
        };

        return (
            <div className="table-responsive">
                <FetchPending isPending={this.props.corpus.documents.isFetching}
                              success={this.props.corpus.documents.status !== fetchStatusType.error}
                              retryCallback={() => this.props.fetchCorpusDocuments(this.props.corpus.data.values.c_id)}
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
                                onUpload={(files) => this.props.uploadCorpusDocuments(this.props.corpus.data.values.c_id, files)}
                                maxCount={50}
                                uploadText="Drop Text-Files or ZIP-Archive here... or just click..."
                                acceptMimeTypes='text/plain, application/zip,application/x-zip-compressed,multipart/x-zip"'
                            />
                        </FetchPending>
                    </Card.Body>
                    <Card.Body>
                        <Card.Title>Available: 2 <span
                            className="float-right text-secondary font-weight-light">Updated: 2020-01-01 12:12:23</span></Card.Title>
                        {this._renderDocuments()}
                    </Card.Body>
                </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(CorpusDocuments);