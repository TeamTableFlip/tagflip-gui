import React, {Component} from "react";
import Badge from "react-bootstrap/Badge";
import {SketchPicker} from 'react-color';
import PropTypes from "prop-types";

class ColorPickerBadge extends Component {

    constructor(props) {
        super(props);
        this.state = {
            color: "#000000".replace(/0/g, function () {
                return (~~(Math.random() * 16)).toString(16);
            })
        };
    }

    componentDidMount() {
        if(this.props.color) {
            this.setState({
                color: this.props.color
            });
        }
        else {
            this.props.updateColorCallback(this.state.color);
        }
    }

    handleChangeComplete (color) {
        this.setState({ color: color.hex });
        this.props.updateColorCallback(color.hex);
    };

    render() {
        return (
            <React.Fragment>
                <Badge variant="primary" style={{backgroundColor: this.state.color}}>{this.state.color}</Badge>
                <SketchPicker
                    color={ this.state.color }
                    onChange={ (color) => this.handleChangeComplete(color) } />
            </React.Fragment>
        );
    }

}

ColorPickerBadge.propTypes = {
    updateColorCallback: PropTypes.func.isRequired,
    color: PropTypes.string
};

export default ColorPickerBadge