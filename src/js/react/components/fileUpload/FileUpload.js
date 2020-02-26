import React, {Component} from 'react';
import PropTypes from "prop-types";
import Dropzone from 'react-dropzone'
import './FileUpload.css';
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";


class FileUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            dragOver: false,
            rejected: false
        }
    }

    _onDrop(files) {
        this.setState({
            files: files
        });
        this.props.onSelect(files);
    }

    _activeClasses() {
        let activeClasses = ["dropzone"];
        if (this.state.dragOver) {
            activeClasses.push("dropZoneActiveDrag")
        }

        return activeClasses.join(" ")
    }

    acceptDrop(files) {
        this.setState({
            files: files
        })
    }

    _reset() {
        this.setState({
            files: [],
            dragOver: false,
            rejected: false
        })
    }

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
                                        this.setState({files: this.state.files.filter(f => f !== file)})
                                    }}
                            ><FontAwesomeIcon icon={faTrash}/></Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }

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
                            <Button variant="primary" className="mr-1" onClick={() => this._reset()}>
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
                                      onDragLeave={() => this.setState({dragOver: false})}
                                      onDragEnter={(k) => {
                                          console.log(k)
                                          this.setState({dragOver: true})
                                      }}
                                      onDrop={() => {
                                          this.setState({dragOver: false})
                                      }}
                                      onDropAccepted={acceptedFiles => {
                                          this.acceptDrop(acceptedFiles)
                                      }}
                                      onDropRejected={(k) => {
                                          this.setState({rejected: true})
                                      }}
                                      multiple={this.props.maxCount !== 1}
                                      accept={this.props.acceptMimeTypes}
                            >
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                        <div {...getRootProps()} className={this._activeClasses()}>
                                            <input {...getInputProps()} />
                                            <p className="d-flex align-items-center justify-content-center">Select
                                                single
                                                text file or ZIP-Archive containing text files.</p>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>
                            {(this.state.files.length > 0 && this.state.files.length <= this.props.maxCount) && (
                                <React.Fragment>
                                    <Card.Title className="mt-3">
                                        Selected File
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


FileUpload.propTypes = {
    onUpload: PropTypes.func.isRequired,
    acceptMimeTypes: PropTypes.string.isRequired,
    uploadText: PropTypes.string.isRequired,
    isUploading: PropTypes.bool.isRequired,
    maxCount: PropTypes.number.isRequired,
};

export default FileUpload;