import React, {Component} from "react";
import Dropdown from "react-bootstrap/Dropdown";
import FormControl from "react-bootstrap/FormControl";
import PropTypes from "prop-types";

class SearchableDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: undefined,
            searchSubstring: ""
        };
        this._renderItems = this._renderItems.bind(this);
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
                        this.setState({
                            selectedOption: option,
                            searchSubstring: ""
                        });
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
        return <FormControl autoFocus
                            placeholder={this.props.searchPlaceholder}
                            value={this.state.searchSubstring}
                            onChange={e => this.setState({searchSubstring: e.target.value})} />
    }

    render() {
        return <Dropdown>
            <Dropdown.Toggle variant={this.props.variant || "outline-primary"}>
                {this._renderToggleText()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {this._renderSearchField()}
                {this._renderItems()}
            </Dropdown.Menu>
        </Dropdown>
    }

}

SearchableDropdown.propTypes = {
    buttonText: PropTypes.string.isRequired,    // The text to de displayed in the Dropdown
    searchPlaceholder: PropTypes.string,        // The placeholder for the search text field
    label: PropTypes.string,                    // The property of the option-object to be used for display
    optionKey: PropTypes.string,                // The property of the option-object to be used as a key
    variant: PropTypes.string,                  // The bootstrap styling of the Dropdown
    options: PropTypes.array.isRequired,        // The list of objects/strings to be displayed as Dropdown-Items
    onChange: PropTypes.func.isRequired,        // Is called when clicking on a DropdownItem - 1 param: option
    filter: PropTypes.func                      // Is called when typing in the search field - 2 params: option, searchSubstring
};

export default SearchableDropdown;