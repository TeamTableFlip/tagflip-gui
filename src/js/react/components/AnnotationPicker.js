import React, {Component} from "react";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import ListGroup from "react-bootstrap/ListGroup";

class AnnotationPicker extends Component {

    constructor(props) {
        super(props);
        this._renderAnnotationsTable = this._renderAnnotationsTable.bind(this)
    }

    render() {
        return (
            <Modal show={this.props.textSelected} onHide={() => {

            }}>
                <Modal.Header>
                    <Modal.Title>Pick the correct Annotation!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this._renderAnnotationsTable()}
                </Modal.Body>

            </Modal>
        );
    }

    _renderAnnotationsTable() {
        console.log(this.props.annotations)
        if(!this.props.annotations)
            return null;
        return this.props.annotations.map((annotation, idx) => {
            return   <ListGroup horizontal={"sm"} key={idx}>
                <ListGroup.Item action onClick={()=>{this.props.onPicked(annotation)}} sytle={{backgroundColor: annotation.color}}>{annotation.name}</ListGroup.Item>
            </ListGroup>

        })
    };
}

AnnotationPicker.propTypes = {
    textSelected: PropTypes.bool,
    annotations: PropTypes.array,
    onPicked: PropTypes.func
};

export default AnnotationPicker
