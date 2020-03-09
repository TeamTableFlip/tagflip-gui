import React, {Component} from "react";
import PropTypes from 'prop-types';
import Modal from "react-bootstrap/Modal";
import {Spinner} from "react-bootstrap";

/**
 * A React Component displaying a modal dialog prompting the Server being inaccessible.
 */
class ServerNotAvailableInfo extends Component {
    /**
     * Create a new ServerNotAvailableInfo.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
    }

    /**
     * Renders the ServerNotAvailableInfo.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <Modal show={!this.props.serverAvailable} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title>Server not available</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The server is currently not available. Please await connectivity.</p>
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" variant="primary"/>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }

}

ServerNotAvailableInfo.propTypes = {
    serverAvailable: PropTypes.bool.isRequired // Determine whether the server is currently available or not
};

export default ServerNotAvailableInfo;