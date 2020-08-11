import React, { Component } from "react";
import PropTypes from 'prop-types';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ButtonProps } from "react-bootstrap";

type Variant = ButtonProps["variant"];

const propTypes = {
    show: PropTypes.bool.isRequired,            // Shall the dialog be visible?
    message: PropTypes.string.isRequired,       // The message to be displayed
    acceptText: PropTypes.string.isRequired,    // The text of the Confirm-Button
    // Hack
    acceptVariant: PropTypes.nominalTypeHack,   // The react-bootstrap style for the Confirm-Button
    onAccept: PropTypes.func.isRequired,        // Function to be called when confirming the dialog - 1 param: event
    onCancel: PropTypes.func.isRequired         // Function to be called when aborting the dialog - 1 param: event
};



type Props = PropTypes.InferProps<typeof propTypes>;

/**
 * A React Component which represents a modal dialog for handling confirmations of any kind.
 */
class ConfirmationDialog extends Component<Props> {
    /**
     * Create a new ConfirmationDialog.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
    }

    /**
     * Renders the confirmation dialog displaying a custom message.
     * @returns {*} The confirmation dialog to be rendered.
     */
    render() {
        const variant: Variant = this.props.acceptVariant || 'primary';

        return (
            <Modal show={this.props.show} onHide={() => { }}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{this.props.message}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={variant} className="mr-1" onClick={this.props.onAccept}>
                        {this.props.acceptText}
                    </Button>
                    <Button variant="light" onClick={this.props.onCancel}>Abort</Button>
                </Modal.Footer>
            </Modal>
        );
    }

}

export default ConfirmationDialog;