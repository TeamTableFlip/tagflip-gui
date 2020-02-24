import React, {Component} from 'react';
import PropTypes from "prop-types";
import Dropzone from 'react-dropzone'
import './FileUpload.css';


class FileUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            dragOver: false,
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

    _renderForm() {

    }

    render() {
        return (
            <div>
                <div>
                    {this.state.files.length === 0 && (
                        <Dropzone onDragLeave={() => this.setState({dragOver: false})}
                                  onDragEnter={() => this.setState({dragOver: true})}
                                  onDrop={() => {
                                      this.setState({dragOver: false})
                                  }}
                                  onDropAccepted={acceptedFiles => {
                                      this.acceptDrop(acceptedFiles)
                                  }}>
                            {({getRootProps, getInputProps}) => (
                                <section>
                                    <div {...getRootProps()} className={this._activeClasses()}>
                                        <input {...getInputProps()} />
                                        <p className="d-flex align-items-center justify-content-center">Drag 'n' drop
                                            some files here, or click to select files</p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    )}
                </div>
            </div>
        );
    }
}


FileUpload.propTypes = {
    acceptMimeTypes: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    uploadText: PropTypes.string.isRequired,
};

export default FileUpload;