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
        this._getDropdownText = this._getDropdownText.bind(this);
    }

    componentDidMount() {
        if(this.props.initOption) {
            this.setState({
                selectedOption: this.props.initOption
            });
        }
    }

    _renderItems() {
        return this.props.options
            .filter(option => {
                if(this.props.filter) {
                    return this.props.filter(option, this.state.searchSubstring);
                }
                if(this.props.label && option.hasOwnProperty(this.props.label)) {
                    return option[this.props.label].toString().toLowerCase().includes(this.state.searchSubstring.toLowerCase())
                }
                return option.toString().toLowerCase().includes(this.state.searchSubstring.toLowerCase())
            })
            .map(option => {
                let key = 0;
                let hasOptionsKey = this.props.optionKey && option.hasOwnProperty(this.props.optionKey);

                // Determine key
                if(hasOptionsKey) {
                    key = option[this.props.optionKey];
                }
                else {
                    key = option;
                }

                return (
                    <Dropdown.Item
                        key={key}
                        active={
                            this.state.selectedOption && (
                                hasOptionsKey && key === this.state.selectedOption[this.props.optionKey] ||
                                !hasOptionsKey && key === this.state.selectedOption
                            )
                        }
                        onClick={e => {
                        this.setState({
                            selectedOption: option,
                            searchSubstring: ""
                        });
                        this.props.onChange(option);
                    }}>
                        {this._getDropdownText(option)}
                    </Dropdown.Item>
                )
            });
    }

    _getDropdownText(option) {
        if(option) {
            if(this.props.getText)
                return this.props.getText(option);
            else if(this.props.label && option.hasOwnProperty(this.props.label))
                return option[this.props.label];
            return option;
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
        return <Dropdown disabled>
            <Dropdown.Toggle id={this.props.toggleId} variant={this.props.variant || "outline-primary"}>
                {this._getDropdownText(this.state.selectedOption)}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {this._renderSearchField()}
                {this._renderItems()}
            </Dropdown.Menu>
        </Dropdown>
    }

}

SearchableDropdown.propTypes = {
    toggleId: PropTypes.string.isRequired,      // The id of the Dropdown.Toggle
    buttonText: PropTypes.string.isRequired,    // The text to de displayed in the Dropdown
    searchPlaceholder: PropTypes.string,        // The placeholder for the search text field
    label: PropTypes.string,                    // The property of the option-object to be used for display
                                                //  - Will be ignored when using the getText property
    optionKey: PropTypes.string,                // The property of the option-object to be used as a key
    variant: PropTypes.string,                  // The bootstrap styling of the Dropdown
    options: PropTypes.array.isRequired,        // The list of objects/strings to be selectable in the Dropdown
                                                //  - If label and getText are not set, the options will be used for display
    initOption: PropTypes.object,               // Default option when rendering the Component
                                                //  - Can be used to remember state after refreshing the page
    disabled: PropTypes.bool,                   // The flag to determine whether the Dropdown is disabled or not
    onChange: PropTypes.func.isRequired,        // Is called when clicking on a DropdownItem - 1 param: option
    filter: PropTypes.func,                     // Is called when typing in the search field - 2 params: option, searchSubstring
    getText: PropTypes.func                     // Is called when rendering the DropdownItem - 1 param: option
};

export default SearchableDropdown;