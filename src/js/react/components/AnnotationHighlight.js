import React from "react";
import ReactDom from "react-dom";
import Tooltip from "react-bootstrap/Tooltip";
import PropTypes from "prop-types";
import "./AnnotationEditorCodeMirror.scss"
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Overlay from "react-bootstrap/Overlay";

class AnnotationHighlight extends React.Component {
    constructor(props) {
        super(props);
        this._handleClick = this._handleClick.bind(this);
        this._hideIfVisible = this._hideIfVisible.bind(this);
        this.popupTargetRef = React.createRef();
        this.state = {
            showPopup: false
        }
    }

    _handleClick() {
        this.setState({showPopup: !this.state.showPopup})
    }

    _hideIfVisible(showPopup) {
        const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
        if(this.state.showPopup && isVisible(ReactDom.findDOMNode(this.popupTargetRef.current))) {
            this.setState({showPopup: false})
        }
    }

    _onDelete() {
        this.setState({showPopup: !this.state.showPopup})
        this.props.onDelete();
    }

    componentWillUnmount() {
        // alert("help, i die")
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
                    <Tooltip  id={`tooltip-${this.props.tag.t_id}`}>
                        <Container className="mb-2">
                            <Row><Col className="text-left">ID:</Col><Col className="text-right">{this.props.tag.t_id}</Col></Row>
                            <Row><Col className="text-left">From:</Col><Col className="text-right">{this.props.tag.start_index}</Col></Row>
                            <Row><Col className="text-left">To:</Col><Col className="text-right">{this.props.tag.end_index}</Col></Row>
                        </Container>
                        {this.props.onDelete && <Button variant="danger" size="sm" onClick={() => this._onDelete()}>Delete</Button>}

                    </Tooltip>
                </Overlay>
            </React.Fragment>);
    }


}
AnnotationHighlight.propTypes = {
    text: PropTypes.string,
    tag: PropTypes.object,
    annotation: PropTypes.object,
    tooltip: PropTypes.any,
    onDelete: PropTypes.any,
};

export default AnnotationHighlight
