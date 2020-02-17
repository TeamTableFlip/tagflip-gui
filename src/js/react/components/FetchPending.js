import React, {Component} from "react";
import Badge from "react-bootstrap/Badge";
import PropTypes from 'prop-types';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {BrowserRouter as Router} from "react-router-dom";
import {Spinner} from "react-bootstrap";
import fetchStatusType from "../../redux/actions/FetchStatusTypes";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";

class FetchPending extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.isPending) {
            return (
                <div className="d-flex justify-content-center p-3">
                    <Spinner animation="border" variant="primary"/>
                </div>
            )
        }
        if (!this.props.success)
            return (
                <Alert variant="warning">
                    <p>Could not fetch data from server.</p>
                    {
                        this.props.retryCallback && (
                            <Button onClick={() => this.props.retryCallback()} variant="primary">
                                Try again
                            </Button>
                        )
                    }
                    {
                        !this.props.retryCallback && (
                            <p>Contact admin if problem continues.</p>
                        )
                    }

                </Alert>
            );

        return this.props.children;
    }
}

FetchPending.propTypes = {
    isPending: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
    retryCallback: PropTypes.func
};

export default FetchPending;