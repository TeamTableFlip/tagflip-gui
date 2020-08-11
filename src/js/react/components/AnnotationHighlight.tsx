import React, { createRef, ReactInstance } from "react";
import ReactDom from "react-dom";
import Tooltip from "react-bootstrap/Tooltip";
import PropTypes from "prop-types";
import "./AnnotationEditorCodeMirror.scss"
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Overlay from "react-bootstrap/Overlay";

import { Annotation } from "../../Annotation";
import { TagValue } from "../../redux/types";
import { ButtonProps } from "react-bootstrap";

const propTypes = {
    text: PropTypes.string,         // The annotated text to be displayed
    tag: PropTypes.object,          // The Tag information to be displayed in the Tooltip
    annotation: PropTypes.object,   // The Annotation information to shown next to the text
    onDelete: PropTypes.any         // Is called when deleting the Tag - 0 params
};

interface Tag {
    t_id: number;
    start_index: number;
    end_index: number;
}

interface Props {
    id: string;
    text: string;
    tag: Tag;
    annotation: { name: string; color: string };
    onDelete: () => void;
};

const initialState = {
    showPopup: false
}

type State = typeof initialState;
//type RefType = Button["ref"];

/**
 * A React Component for rendering an annotated text.
 * The text to be rendered will have the background color of the corresponding Annotation. Furthermore there will be a
 * react-bootstrap Tooltip, for displaying the Tag's details.
 */
class AnnotationHighlight extends React.Component<Props, State> {

    popupTargetRef: React.RefObject<any>;

    /**
     * Create a new AnnotationHighlight component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this._handleClick = this._handleClick.bind(this);
        this._hideIfVisible = this._hideIfVisible.bind(this);
        this.popupTargetRef = React.createRef();
        this.state = initialState;
    }

    /**
     * Handle the click event of the AnnotationHighlight.
     * @private
     */
    _handleClick() {
        this.setState({ showPopup: !this.state.showPopup });
    }

    /**
     * Hide the Tooltip when it's visible.
     * @param showPopup A bool to determine whether the Tooltip is currently shown or not.
     * @private
     */
    _hideIfVisible(showPopup) {
        const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
        if (this.state.showPopup && isVisible(ReactDom.findDOMNode(this.popupTargetRef.current))) {
            this.setState({ showPopup: false });
        }
    }

    /**
     * Delete the annotated text, by calling props#onDelete().
     * @private
     */
    onDelete() {
        this.setState({ showPopup: !this.state.showPopup });
        this.props.onDelete();
    }

    /**
     * React lifecycle method. Toggles the visibility of the react-bootstrap Tooltip.
     */
    componentWillUnmount() {
        // alert("help, i die")
        this.setState({ showPopup: !this.state.showPopup });
    }

    /**
     * Render the AnnotationHighlight component.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <React.Fragment>
                <Button
                    ref={this.popupTargetRef}
                    onClick={this._handleClick}
                    className="annotation"
                    style={{ background: this.props.annotation.color }}>
                    {this.props.annotation.name}
                </Button>

                <Overlay
                    show={this.state.showPopup}
                    target={this.popupTargetRef.current}
                    placement="top"
                    containerPadding={20}
                >
                    <Tooltip id={`tooltip-${this.props.tag.t_id}`}>
                        <Container className="mb-2">
                            <Row><Col className="text-left">Text:</Col><Col className="text-left">{this.props.text}</Col></Row>
                            <Row><Col className="text-left">ID:</Col><Col className="text-right">{this.props.tag.t_id}</Col></Row>
                            <Row><Col className="text-left">From:</Col><Col className="text-right">{this.props.tag.start_index}</Col></Row>
                            <Row><Col className="text-left">To:</Col><Col className="text-right">{this.props.tag.end_index}</Col></Row>
                        </Container>
                        {this.props.onDelete && <Button variant="danger" size="sm" onClick={() => this.onDelete()}>Delete</Button>}

                    </Tooltip>
                </Overlay>
            </React.Fragment>);
    }
}

export default AnnotationHighlight
