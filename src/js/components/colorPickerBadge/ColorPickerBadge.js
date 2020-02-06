import React, {Component} from "react";
import Badge from "react-bootstrap/Badge";
import {SketchPicker} from 'react-color';

class ColorPickerBadge extends Component {

    constructor(props) {
        super(props);
        this.state = {
            color: "#000000".replace(/0/g, function () {
                return (~~(Math.random() * 16)).toString(16);
            })
        }
    }

    handleChangeComplete (color) {
        this.setState({ color: color.hex });
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

export default ColorPickerBadge