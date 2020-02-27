import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faTrash} from "@fortawesome/free-solid-svg-icons";
import fetchStatusType from "../../redux/actions/FetchStatusTypes";
import FetchPending from "./FetchPending";
import ConfirmationDialog from "./dialogs/ConfirmationDialog";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import {style} from "redux-logger/src/diff";


class ShowDocument extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal size="xl"
                   show={this.props.show} onHide={() => this.props.onHide()}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{whiteSpace: "pre-wrap"}}>
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

ShowDocument.propTypes = {
    show: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
    title: PropTypes.string,
    text: PropTypes.string,
    retryCallback: PropTypes.func,
    onHide: PropTypes.func.isRequired
};

export default ShowDocument;
