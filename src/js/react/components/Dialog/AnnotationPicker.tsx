import React, {Component} from "react";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import ListGroup from "react-bootstrap/ListGroup";
import Alert from "react-bootstrap/Alert";
import chroma from "chroma-js";

const propTypes = {
    show: PropTypes.bool,   // If true, this component will be visible; otherwise not
    annotations: PropTypes.array,   // The list of all pickable Annotations available
    onPicked: PropTypes.func,       // Is called picking an Annotation - 1 param: annotation
    onCanceled: PropTypes.func      // Is called when hiding the Modal Dialog - No param
};

type Props = PropTypes.InferProps<typeof propTypes>;

/**
 * A React Component for selecting an Annotation from a react-bootstrap Modal dialog.
 */
class AnnotationPicker extends Component<Props> {


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
        if (!this.props.annotations || this.props.annotations.length === 0)
            return <Alert variant="info">No Annotations. Please select an Annotation Set with Annotations.</Alert>;
        return (<ListGroup>
            {
                this.props.annotations.map((annotation, idx) => {
                        return (
                            <ListGroup.Item action key={idx} onClick={() => {
                                this.props.onPicked(annotation)
                            }}
                                            style={{
                                                backgroundColor: annotation.color,
                                                color: chroma(annotation.color).luminance() < 0.35 ? '#fff' : '#000'
                                            }}
                            >{annotation.name}</ListGroup.Item>
                        )
                    }
                )}
        </ListGroup>)
    };


}


export default AnnotationPicker
