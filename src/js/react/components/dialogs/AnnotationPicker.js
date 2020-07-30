import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import ListGroup from "react-bootstrap/ListGroup";

/**
 * A React Component for selecting an Annotation from a react-bootstrap Modal dialog.
 */
class AnnotationPicker extends Component {
    /**
     * Create a new AnnotationPicker component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this._renderAnnotationsList = this._renderAnnotationsList.bind(this)
    }

    /**
     * Render the AnnotationPicker component.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <Modal show={this.props.show} onHide={() => {
                this.props.onCanceled();
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Pick your Annotation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this._renderAnnotationsList()}
                </Modal.Body>

            </Modal>
        );
    }

    /**
     * Get all pickable Annotations as a react-bootstrap ListGroup.
     * @returns {*} null if there are no Annotations, otherwise a ListGroup containing all pickable Annotations.
     * @private
     */
    _renderAnnotationsList() {
        if (!this.props.annotations)
            return null;
        return this.props.annotations.map((annotation, idx) => {
            return <ListGroup horizontal={"sm"} key={idx}>
                <ListGroup.Item action onClick={() => { this.props.onPicked(annotation) }} sytle={{ backgroundColor: annotation.color }}>{annotation.name}</ListGroup.Item>
            </ListGroup>

        })
    };
}

AnnotationPicker.propTypes = {
    show: PropTypes.bool,   // If true, this component will be visible; otherwise not
    annotations: PropTypes.array,   // The list of all pickable Annotations available
    onPicked: PropTypes.func,       // Is called picking an Annotation - 1 param: annotation
    onCanceled: PropTypes.func      // Is called when hiding the Modal Dialog - No param
};

export default AnnotationPicker
