import React, {Component} from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";

class SearchableDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: undefined,
            searchSubstring: ""
        };
        this._renderItems = this._renderItems.bind(this);
        this._dropdownMenu = this._dropdownMenu.bind(this);
        this._renderSearchField = this._renderSearchField.bind(this);
    }

    componentDidMount() {

    }

    _renderItems() {
        return this.props.options
            .filter(option => {
                if(this.props.filter) {
                    console.log("Calling this.props.filter");
                    return this.props.filter(option, this.state.searchSubstring);
                }
                if(this.props.label !== undefined && option.hasOwnProperty(this.props.label)) {
                    console.log("Filtering with label");
                    return option[this.props.label].toString().toLowerCase().includes(this.state.searchSubstring.toLowerCase())
                }
                console.log("Filtering without label");
                return option.toString().toLowerCase().includes(this.state.searchSubstring.toLowerCase())
            })
            .map(option => {
                let text = "";
                let key = 0;

                // Determine text
                if(this.props.label !== undefined && option.hasOwnProperty(this.props.label)) {
                    text = option[this.props.label];
                }
                else {
                    text = option;
                }

                // Determine key
                if(this.props.optionKey !== undefined && option.hasOwnProperty(this.props.optionKey)) {
                    key = option[this.props.optionKey];
                }
                else {
                    key = option;
                }

                return (
                    <Dropdown.Item key={key} onClick={e => {
                        this.setState({selectedOption: option});
                        this.props.onChange(option);
                    }}>
                        {text}
                    </Dropdown.Item>
                )
            });
    }

    _renderToggleText() {
        if(this.state.selectedOption) {
            if(this.props.label !== undefined && this.state.selectedOption.hasOwnProperty(this.props.label))
                return this.state.selectedOption[this.props.label];
            return this.state.selectedOption;
        }
        return this.props.buttonText;
    }

    _renderSearchField() {
        return <Form.FormControl autoFocus
                              placeholder={this.props.searchPlaceholder}
                              value={this.state.searchSubstring}
                              onChange={e => this.setState({searchSubstring: e.target.value})}
            />
    }

    _dropdownMenu() {
        return this._renderSearchField();
            {/*<ul>*/}
                {/*{React.Children.toArray(this.props.options)}*/}
            {/*</ul>*/}

    }

    render() {
        return <Dropdown>
            <Dropdown.Toggle variant={this.props.variant || "outline-primary"}>
                {this._renderToggleText()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {/*{this._renderSearchField()}*/}
                {this._renderItems()}
            </Dropdown.Menu>
        </Dropdown>
    }

}

SearchableDropdown.propTypes = {
    buttonText: PropTypes.string.isRequired,
    searchPlaceholder: PropTypes.string,
    label: PropTypes.string,
    optionKey: PropTypes.string,
    variant: PropTypes.string,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,        // 1 param: option
    filter: PropTypes.func                      // 2 params: option, searchSubstring
};

export default SearchableDropdown;