import React from "react";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import PropTypes from "prop-types";
import "./AnnotationEditorCodeMirror.scss"
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Overlay from "react-bootstrap/Overlay";

let id = 0;

class AnnotationHighlight extends React.Component {
    constructor(props) {
        super(props);
        this._handleClick = this._handleClick.bind(this);
        this.popupTargetRef = React.createRef();

        this.state = {
            showPopup: false
        }
    }

    _handleClick() {
        this.setState({showPopup: !this.state.showPopup})
    }

    componentWillUnmount() {
        this.setState({showPopup: !this.state.showPopup})
    }

    render() {
        return (
            <React.Fragment>
                <span ref={ this.popupTargetRef} onClick={this._handleClick}
                    className="annotation"
                    style={{background: this.props.annotation.color}}>
                    <span className="annotationType">{this.props.annotation.name}</span>
                    <span className="annotationText">
                        {this.props.text}
                    </span>
                </span>
                <Overlay
                    show={this.state.showPopup}
                    target={this.popupTargetRef}
                    placement="top"
                    containerPadding={20}
                >
                    <Tooltip  id={`tooltip-${this.props.tooltip}`}>
                        <Container className="mb-2">
                            <Row><Col className="text-left">ID:</Col><Col className="text-right">xy</Col></Row>
                            <Row><Col className="text-left">From:</Col><Col className="text-right">223x</Col></Row>
                            <Row><Col className="text-left">To:</Col><Col className="text-right">455x</Col></Row>
                        </Container>
                        {this.props.onDelete && <Button variant="danger" size="sm" onClick={() => this.props.onDelete()}>Delete</Button>}

                    </Tooltip>
                </Overlay>
            </React.Fragment>);
    }


}
AnnotationHighlight.propTypes = {
    text: PropTypes.string,
    annotation: PropTypes.object,
    tooltip: PropTypes.any,
    onDelete: PropTypes.any,
};

export default AnnotationHighlight
