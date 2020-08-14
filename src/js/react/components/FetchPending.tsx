import React, { Component } from "react";
import PropTypes from 'prop-types';
import Button from "react-bootstrap/Button";
import { Spinner } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { FetchState } from "../../redux/types";

const propTypes = {
    isPending: PropTypes.bool.isRequired,               // Determine whether the data is still being fetched or not
    silent: PropTypes.bool,                             // If silent, the Spinner won't be shown
    success: PropTypes.bool.isRequired,                 // When not pending anymore: Determine whether the fetch process
    // was successful or not. If it was, render all the child nodes
    inheritChildrenHeight: PropTypes.bool,              // The height of the inherited child components
    retryCallback: PropTypes.func                       // Is called by onClick, when trying to refetch data - No params
};

const defaultProps = {
    silent: false,
    inheritChildrenHeight: true
};

type Props = PropTypes.InferProps<typeof propTypes>;

/**
 * A React Component to be used as a parent for Components, which require data to be fetched from a backend.
 *
 * This component will display a react-bootstrap Spinner, as long as data is being fetched. When the data is received
 * successfully, the child nodes will be rendered. If the data could not be fetched properly, a react-bootstrap Alert
 * will be shown with a warning, to inform the user about the failure. When failing to fetch, the user has the chance to
 * retry the fetching process, if the corresponding callback function is defined in the properties.
 */
class FetchPending extends Component<Props> {
    childNode: React.RefObject<HTMLDivElement>;

    /**
     * Create a new FetchPending component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.childNode = React.createRef();
        this.state = {
            childrensHeight: undefined
        };
    }

    /**
     * Render the FetchPending component, by rendering a Spinner, a warning message, or all its child Components.
     * @returns {*} The component to be rendered.
     */
    render() {
        if (this.props.isPending && !this.props.silent) {
            return (
                <div className="d-flex justify-content-center align-items-center p-3 w-100 h-100" style={{
                    height: (this.props.inheritChildrenHeight && this.childNode.current && this.childNode.current.clientHeight) ? this.childNode.current.clientHeight : "auto"
                }}>
                    <Spinner animation="border" variant="dark" />
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
        if (!this.props.inheritChildrenHeight)
            return this.props.children;
        return (
            <div ref={this.childNode} className="w-100 h-100">
                {this.props.children}
            </div>
        );
    }
}


export default FetchPending;