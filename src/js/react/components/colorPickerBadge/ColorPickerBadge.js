import React, {Component} from "react";
import Badge from "react-bootstrap/Badge";
import {SketchPicker} from 'react-color';
import PropTypes from "prop-types";

/**
 * A React Component for displaying a react.bootstrap Badge and a color picker next to it.
 */
class ColorPickerBadge extends Component {
    /**
     * Create a new ColorPickerBadge component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.state = {
            color: "#000000".replace(/0/g, function () {
                return (~~(Math.random() * 16)).toString(16);
            })
        };
    }

    /**
     * React lifecycle method. Updates the color when mounted.
     */
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

    /**
     * Handle the successful selection of picking a color from the color picker.
     * @param color The picked color.
     */
    handleChangeComplete(color) {
        this.setState({ color: color.hex });
        this.props.updateColorCallback(color.hex);
    };

    /**
     * Render the ColorPickerBadge component.
     * @returns {*} The component to be rendered.
     */
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