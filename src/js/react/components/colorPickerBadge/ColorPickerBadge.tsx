import React, {Component} from "react";
import Badge from "react-bootstrap/Badge";
import {SketchPicker} from 'react-color';
import PropTypes from "prop-types";


const propTypes = {
    updateColorCallback: PropTypes.func.isRequired, // Is called when the color is being picked - 1 param: color
    color: PropTypes.string                         // The initial color
};

type Props = PropTypes.InferProps<typeof propTypes>;

const initialState = {
    color: "#000000"
};

type State = typeof initialState;

/**
 * A React Component for displaying a react-bootstrap Badge and a color picker next to it.
 */
class ColorPickerBadge extends Component<Props, State> {
    /**
     * Create a new ColorPickerBadge component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.state = {
            color: props.color
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if(prevProps.color !== this.props.color) {
            this.setState({
                color: this.props.color
            }, () => this.props.updateColorCallback(this.state.color))
        }
    }

    /**
     * Handle the successful selection of picking a color from the color picker.
     * @param color The picked color.
     */
    handleChangeComplete(color) {
        this.setState({color: color.hex});
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
                    color={this.state.color}
                    onChange={(color) => this.handleChangeComplete(color)}/>
            </React.Fragment>
        );
    }

}

export default ColorPickerBadge
