import React, { Component } from "react";
import FetchPending from "../FetchPending/FetchPending";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

interface Props {
    show: boolean;        // Determine whether the dialog is visible or not
    isLoading: boolean;   // The isPending property for FetchPending
    success: boolean;     // The success property for FetchPending
    title: string;                // The title of the dialog
    text: string;                 // The text of the Document to be displayed
    retryCallback?: () => void;          // The retryCallback function for FetchPending
    onHide: () => void;       // Is called when hiding the dialog - No params
};


/**
 * A React Component to display a Document's content as a react-bootstrap Modal dialog.
 */
class ShowDocument extends Component<Props> {
    /**
     * Create a new ShowDoument component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
    }

    /**
     * Render the ShowDocument component.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <Modal size="xl"
                show={this.props.show} onHide={() => this.props.onHide()}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ whiteSpace: "pre-wrap" }}>
                    <FetchPending
                        isPending={this.props.isLoading}
                        success={this.props.success}>
                        {this.props.text}
                    </FetchPending>
                </Modal.Body>
            </Modal>
        );
    }
}


export default ShowDocument;
