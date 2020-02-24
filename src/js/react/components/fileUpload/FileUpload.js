import React, {Component} from 'react';
import PropTypes from "prop-types";
import Dropzone from 'react-dropzone'
import './FileUpload.css';
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";


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
                                      multiple={false}
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
                            {this.state.files.length > 0 && (
                                <React.Fragment>
                                    <Card.Title className="mt-3">
                                        Selected File
                                    </Card.Title>

                                    {this.state.files[0].name}
                                    <ProgressBar animated now={45} />
                                    <Button variant="success" className="mt-3" type="submit" disabled={this.props.isUploading}>Upload</Button>
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
};

export default FileUpload;