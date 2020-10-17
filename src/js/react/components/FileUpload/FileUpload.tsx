import React, {Component} from 'react';
import PropTypes from "prop-types";
import Dropzone from 'react-dropzone'
import './FileUpload.css';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {Spinner} from "react-bootstrap";

const propTypes = {
    onUpload: PropTypes.func,            // Is called when uploading the files - 1 param: files
    onChange: PropTypes.func,                       // Is called when selection changes- 1 param: files
    acceptMimeTypes: PropTypes.string,   // The accepted mime types for upload
    uploadText: PropTypes.string.isRequired,        // The text to display in the Dropzone
    isUploading: PropTypes.bool,         // If true, the Upload-Button will be disabled
    onTooManyFiles: PropTypes.func,                 // Called if maxCount is exceeded.
    onTypeMismatch: PropTypes.func,                 // Called if file not in acceptMimeTypes.
    maxCount: PropTypes.number.isRequired,           // Determine the maximum amount of files to upload
};

const initialState = {
    files: new Array<File>(),
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

    static defaultProps : Props = {
        onChange: () => {return;},
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        let reset = false;
        if (this.state.files.length > this.props.maxCount) {
            this.props.onTooManyFiles(this.state.files.length, this.props.maxCount);
            reset = true;
        }
        if (this.state.rejected) {
            this.props.onTypeMismatch(this.props.acceptMimeTypes)
            reset = true;
        }
        if (prevProps.isUploading && !this.props.isUploading)
            reset = true
        if (reset)
            this._reset()
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
        }, () => this.props.onChange(this.state.files))
    }

    /**
     * Reset the current state to default, so new files can be uploaded.
     * @private
     */
    _reset() {
        this.setState({
            files: new Array<File>(),
            dragOver: false,
            rejected: false
        }, () => this.props.onChange(this.state.files))
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
                    <th scope="col"/>
                </tr>
                </thead>
                <tbody>
                {this.state.files.map((file: File) => (
                    <tr key={file.name}>
                        <td>{file.name}</td>
                        <td>
                            <Button size="sm" variant="danger"
                                    className="float-right"
                                    disabled={this.props.isUploading}
                                    onClick={() => {
                                        this.setState({files: this.state.files.filter(f => f !== file)}, ()=> this.props.onChange(this.state.files))
                                    }}
                            ><FontAwesomeIcon icon={faTrash}/></Button>
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
                    <Card>
                        <Card.Body>
                            <Dropzone disabled={this.props.isUploading}
                                      onDragLeave={() => this.setState({dragOver: false})}
                                      onDragEnter={(k) => {
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
                                      accept={this.props.acceptMimeTypes ? this.props.acceptMimeTypes : undefined}
                            >
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                        <div {...getRootProps()} className={this._activeClasses()}>
                                            <input {...getInputProps()} />
                                            <p className="d-flex align-items-center justify-content-center">{this.props.uploadText}</p>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>
                            {(this.state.files.length > 0 && this.state.files.length <= this.props.maxCount) && (
                                <>
                                    <Card.Title className="mt-3">
                                        Selected Files
                                    </Card.Title>
                                    {this._renderFileList()}
                                </>

                            )}
                        </Card.Body>
                        {this.props.onUpload && (
                            <Card.Footer>
                                <Button variant="success" className={`float-right ${this.state.files.length === 0 ? 'invisible' : 'visible'}`}
                                        onClick={() => (this.props.onUpload(this.state.files))}
                                        disabled={this.props.isUploading}
                                >
                                    {!this.props.isUploading ? "Upload" : (
                                        <Spinner as="span" aria-hidden="true" role="status" animation="border"
                                                 variant="light" size="sm"/>)}
                                </Button>
                            </Card.Footer>
                        )}
                    </Card>
                </div>
            </div>
        );
    }
}


export default FileUpload;
