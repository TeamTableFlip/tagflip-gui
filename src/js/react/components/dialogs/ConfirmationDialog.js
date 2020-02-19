import React, {Component} from "react";
import PropTypes from 'prop-types';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class ConfirmationDialog extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{this.props.message}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={this.props.onCancel}>Abort</Button>
                    <Button variant="primary" className="mr-1" onClick={this.props.onAccept}>
                        {this.props.acceptText}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

}

ConfirmationDialog.propTypes = {
    show: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    acceptText: PropTypes.string.isRequired,
    onAccept: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default ConfirmationDialog;