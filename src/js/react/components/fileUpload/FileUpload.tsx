import React, { Component } from 'react';
import PropTypes from "prop-types";
import Dropzone from 'react-dropzone'
import './FileUpload.css';
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const propTypes = {
    onUpload: PropTypes.func.isRequired,            // Is called when uploading the files - 1 param: files
    acceptMimeTypes: PropTypes.string.isRequired,   // The accepted mime types for upload
    uploadText: PropTypes.string.isRequired,        // The text to display in the Dropzone
    isUploading: PropTypes.bool.isRequired,         // If true, the Upload-Button will be disabled
    maxCount: PropTypes.number.isRequired           // Determine the maximum amount of files to upload
};

const initialState = {
    files: [],
    dragOver: false,
    rejected: false
}

type Props = PropTypes.InferProps<typeof propTypes>;

type State = typeof initialState;

/**
 * A React Component for displaying a drop zone in which files can be uploaded.
 */
class FileUpload extends Component<Props, State> {
    /**
     * Create a new FileUpload component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    /**
     * Determine which CSS classes to use for the react-dropzone component.
     * @returns {string} The CSS class names to be used.
     * @private
     */
    _activeClasses() {
        let activeClasses = ["dropzone"];
        if (this.state.dragOver) {
            activeClasses.push("dropZoneActiveDrag")
        }

        return activeClasses.join(" ")
    }

    /**
     * Handle the event of dropping accepted files to the react-dropzone component.
     * @param files The dropped in files to be added for upload.
     */
    acceptDrop(files) {
        let filtered_files = files.filter(x => this.state.files.filter(y => x.name === y.name).length === 0);
        this.setState({
            files: [...this.state.files, ...filtered_files]
        })
    }

    /**
     * Reset the current state to default, so new files can be uploaded.
     * @private
     */
    _reset() {
        this.setState({
            files: [],
            dragOver: false,
            rejected: false
        })
    }

    /**
     * Create a Table which displays all selected files to be uploaded.
     * @returns {*} The HTML-Table to be rendered, containing all files to be uploaded.
     * @private
     */
    _renderFileList() {
        return (<table className="table">
            <thead>
                <tr>
                    <th scope="col">File</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {this.state.files.map(file => (
                    <tr key={file.name}>
                        <td>{file.name}</td>
                        <td>
                            <Button size="sm" variant="danger"
                                className="float-right"
                                onClick={() => {
                                    this.setState({ files: this.state.files.filter(f => f !== file) })
                                }}
                            ><FontAwesomeIcon icon={faTrash} /></Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        );
    }

    /**
     * Render the FileUpload component.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <div>
                <div>
                    <Modal show={this.state.rejected} onHide={() => this._reset()}>
                        <Modal.Header>
                            <Modal.Title>File rejected</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>File type does not match one of the following:</p>
                            <p>{this.props.acceptMimeTypes}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" className="mr-1" onClick={() => this.setState({ rejected: false })}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={this.state.files.length > this.props.maxCount} onHide={() => this._reset()}>
                        <Modal.Header>
                            <Modal.Title>Too many files</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Please do not add more than {this.props.maxCount} files at once.</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" className="mr-1" onClick={() => this._reset()}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Card>
                        <Card.Body>
                            <Dropzone disabled={this.props.isUploading}
                                onDragLeave={() => this.setState({ dragOver: false })}
                                onDragEnter={(k) => {
                                    this.setState({ dragOver: true })
                                }}
                                onDrop={() => {
                                    this.setState({ dragOver: false })
                                }}
                                onDropAccepted={acceptedFiles => {
                                    this.acceptDrop(acceptedFiles)
                                }}
                                onDropRejected={(k) => {
                                    this.setState({ rejected: true })
                                }}
                                multiple={this.props.maxCount !== 1}
                                accept={this.props.acceptMimeTypes}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <section>
                                        <div {...getRootProps()} className={this._activeClasses()}>
                                            <input {...getInputProps()} />
                                            <p className="d-flex align-items-center justify-content-center">{this.props.uploadText}</p>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>
                            {(this.state.files.length > 0 && this.state.files.length <= this.props.maxCount) && (
                                <React.Fragment>
                                    <Card.Title className="mt-3">
                                        Selected Files
                                    </Card.Title>
                                    {this._renderFileList()}
                                    <Button variant="success" className="mt-3"
                                        onClick={() => this.props.onUpload(this.state.files)}
                                        disabled={this.props.isUploading}>Upload</Button>
                                </React.Fragment>

                            )}
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }
}


export default FileUpload;