import React, {Component} from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import Button from "react-bootstrap/Button";
import {Spinner} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";

class FetchPending extends Component {

    constructor(props) {
        super(props);
        this.childNode = React.createRef();
        this.state = {
            childrensHeight: undefined
        }
    }

    render() {
        if (this.props.isPending && !this.props.silent) {
            return (
                <div className="d-flex justify-content-center align-items-center p-3" style={{
                    height: (this.childNode.current && this.childNode.current.clientHeight) ? this.childNode.current.clientHeight : "inherit"
                }}>
                    <Spinner animation="border" variant="dark"/>
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
        return (
            <div ref={this.childNode}>
                {this.props.children}
            </div>
        );
    }
}

FetchPending.propTypes = {
    isPending: PropTypes.bool.isRequired,
    silent: PropTypes.bool,
    success: PropTypes.bool.isRequired,
    retryCallback: PropTypes.func
};

FetchPending.defaultProps = {
    silent: false
}

export default FetchPending;