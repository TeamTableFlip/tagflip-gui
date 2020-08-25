import React, {Component} from "react";
import {Alert, Spinner} from "react-bootstrap";

interface Props {
    isPending: boolean;               // Determine whether the data is still being fetched or not
    silent?: boolean;                             // If silent, the Spinner won't be shown
    success: boolean;                 // When not pending anymore: Determine whether the fetch process
    noSuccessMessage?: string,
    // was successful or not. If it was, render all the child nodes
    subtle: boolean
    inheritChildrenHeight?: boolean;   // The height of the inherited child components
    retryCallback?: () => void;                      // Is called by onClick, when trying to refetch data - No params
};

interface State {
}

/**
 * A React Component to be used as a parent for Components, which require data to be fetched from a backend.
 *
 * This component will display a react-bootstrap Spinner, as long as data is being fetched. When the data is received
 * successfully, the child nodes will be rendered. If the data could not be fetched properly, a react-bootstrap Alert
 * will be shown with a warning, to inform the user about the failure. When failing to fetch, the user has the chance to
 * retry the fetching process, if the corresponding callback function is defined in the properties.
 */
class FetchPending extends Component<Props, State> {
    childNode: React.RefObject<HTMLDivElement>;

    static defaultProps: Props;

    /**
     * Create a new FetchPending component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.childNode = React.createRef();
    }


    /**
     * Render the FetchPending component, by rendering a Spinner, a warning message, or all its child Components.
     * @returns {*} The component to be rendered.
     */
    render() {
        if (this.props.isPending && !this.props.subtle && !this.props.silent) {
            return (
                <div className="d-flex justify-content-center align-items-center p-3 w-100 h-100" style={{
                    height: (this.props.inheritChildrenHeight && this.childNode.current && this.childNode.current.clientHeight) ? this.childNode.current.clientHeight : "auto"
                }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            )
        }
        if (this.props.subtle && !this.props.silent) {
            return (
                <div ref={this.childNode} className="w-100 h-100">
                    <div className="d-flex justify-content-end">
                        <Spinner size="sm" animation="border" variant="primary" className={!this.props.isPending ? "invisible" : ""}/>
                    </div>
                    {this.props.children}
                </div>
            );
        }
        if (!this.props.inheritChildrenHeight)
            return this.props.children;

        if (!this.props.success && this.props.noSuccessMessage)
            return (
                <div ref={this.childNode} className="p-2 w-100 h-100">
                    {this.props.noSuccessMessage && (
                        <Alert variant="danger">
                            {this.props.noSuccessMessage}
                        </Alert>)
                    }
                    {this.props.children}
                </div>
            );
        return (
            <div ref={this.childNode} className="w-100 h-100">
                {this.props.children}
            </div>
        );
    }


}

FetchPending.defaultProps = {
    isPending: false,
    success: false,
    silent: false,
    subtle: true,
    inheritChildrenHeight: true
};

export default FetchPending;
