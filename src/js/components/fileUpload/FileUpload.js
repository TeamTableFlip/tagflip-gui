import React, {Component} from 'react';
import PropTypes from "prop-types";
import Dropzone from 'react-dropzone'
import './FileUpload.css';


class FileUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: []
        }
    }

    _onDrop(files) {
        this.setState({
            files: files
        });
        this.props.onSelect(files);
    }

    render() {
        return (
            <div>
                <div>
                    <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                        {({getRootProps, getInputProps}) => (
                            <section>
                                <div {...getRootProps()} className="dropzone">
                                    <input {...getInputProps()} />
                                    <p className="d-flex align-items-center justify-content-center">Drag 'n' drop some files here, or click to select files</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>
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