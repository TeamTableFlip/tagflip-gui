import React from "react";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import PropTypes from "prop-types";
import "./AnnotationEditorCodeMirror.scss"

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
        let reactElement = (
            <span className="annotation" style={{background: this.props.annotation.color + "40"}}>
                <span className="annotationType">{this.props.annotation.name}</span>
                <span className="annotationText">
                    {this.props.text}
                </span>
            </span>
        );

        if (this.props.tooltip) {
            reactElement = (
                <OverlayTrigger
                    ref={this.triggerRef}
                    placement="top"
                    delay={{ show: 50, hide: 200 }}
                    overlay={
                        <Tooltip id={`tooltip-${this.props.tooltip}`}>
                            {this.props.tooltip}
                        </Tooltip>
                    }>
                    {reactElement}
                </OverlayTrigger>
            );
        }
        return reactElement;
    }


}
AnnotationHighlight.propTypes = {
    text: PropTypes.string,
    annotation: PropTypes.object,
    tooltip: PropTypes.any
};

export default AnnotationHighlight
