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

class AnnotationHighlight extends React.Component {
    constructor(props) {
        super(props);
        this._onDelete = this._onDelete.bind(this);
        this.triggerRef = React.createRef();
    }

    _onDelete() {
        this.triggerRef.current.setState({show:false});
    }

    render() {
        let popover = null;

        if (this.props.tooltip) {
            popover = (
                <Tooltip  id={`tooltip-${this.props.tooltip}`}>
                    <Container className="mb-2">
                        <Row><Col className="text-left">ID:</Col><Col className="text-right">xy</Col></Row>
                        <Row><Col className="text-left">From:</Col><Col className="text-right">223x</Col></Row>
                        <Row><Col className="text-left">To:</Col><Col className="text-right">455x</Col></Row>
                    </Container>
                    {this.props.onDelete && <Button variant="danger" size="sm" onClick={() => this.props.onDelete()}>Delete</Button>}

                </Tooltip>
            );
        }

        let reactElement = (
            <OverlayTrigger trigger={['click']} popperConfig={{

            }} placement="top" overlay={popover}>
                <span className="annotation" style={{background: this.props.annotation.color}}>
                    <span className="annotationType">{this.props.annotation.name}</span>
                    <span className="annotationText">
                        {this.props.text}
                    </span>
                </span>
            </OverlayTrigger>
        );

        return reactElement;
    }


}
AnnotationHighlight.propTypes = {
    text: PropTypes.string,
    annotation: PropTypes.object,
    tooltip: PropTypes.any,
    onDelete: PropTypes.fun,
};

export default AnnotationHighlight
