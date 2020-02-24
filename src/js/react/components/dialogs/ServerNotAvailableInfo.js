import React, {Component} from "react";
import PropTypes from 'prop-types';
import Modal from "react-bootstrap/Modal";
import {Spinner} from "react-bootstrap";

class ServerNotAvailableInfo extends Component {
    constructor(props) {
        super(props);
    }

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
    serverAvailable: PropTypes.bool.isRequired,
};

export default ServerNotAvailableInfo;