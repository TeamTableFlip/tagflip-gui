import React, {Component} from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-github";
import PropTypes from "prop-types";
import AnnotationPicker from "./dialogs/AnnotationPicker";

import "./temp-maker.css"

const testvalue = "Killer Bees (2017 film)\n" +
    "From Wikipedia, th"

const initialState = {
    textValue: "",
    timerId: undefined,
    aceEditor: undefined,
    textSelected: false,
    markers: []
};

/**
 * A React component for displaying a working Editor for annotating documents, using the AceEditor component.
 * @deprecated
 */
class AnnotationEditor extends Component {
    /**
     * Create a new AnnotationEditor component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.state = initialState;
        this._onSelection = this._onSelection.bind(this);
        this._onTimeout = this._onTimeout.bind(this);
        this._onLoad = this._onLoad.bind(this);
        this._onPicked = this._onPicked.bind(this);
        this.hasCurrentSelectedText = false;
        this.currentSelectionRange = undefined;
        this.editorRef = React.createRef();
        // let startIndex =  this.state.aceEditor.session.doc.positionToIndex(this.currentSelectionStartPoint);
        // let endIndex =  this.state.aceEditor.session.doc.positionToIndex(this.currentSelectionEndIndex);
    }

    /**
     * Handle timeouts. Will be called each props#timerIntervalMSec milliseconds.
     * @private
     */
    _onTimeout() {

    }

    /**
     * Handle selecting an Annotation for the currently selected text.
     * @param a The picked annotation for the selected text.
     * @private
     */
    _onPicked(a) {
        console.log("done");
        console.log(this.currentSelectionRange);
        let markerRange = {
            startRow: this.currentSelectionRange.start.row,
            startCol:  this.currentSelectionRange.start.column,
            endRow:  this.currentSelectionRange.end.row,
            endCol:  this.currentSelectionRange.end.column,
            className: 'marker'
        };

        // this.state.aceEditor.clearSelection();
        this.setState({markers: this.state.markers.concat(markerRange),textSelected:false});
        console.log(this.state.markers)
    }

    /**
     * Handle the load event of the AceEditor, by adding functionality to certain events such as "mouseup".
     * @param editorRef The instance of the AceEditor.
     * @private
     */
    _onLoad(editorRef) {
        editorRef.on("mouseup", () => {
            console.log("mouse release");
            if (this.hasCurrentSelectedText) {
                this.setState({textSelected: true});
            }
        });
    }

    /**
     * Handle the selection of a text area from the AceEditor.
     * @param aceSelection The Selection-object from the AceEditor instance
     * @see https://ace.c9.io/#nav=api&api=selection
     * @private
     */
    _onSelection(aceSelection) {
        this.hasCurrentSelectedText = this.editorRef.current.editor.getSelectedText().length > 0;
        if (this.hasCurrentSelectedText)
            this.currentSelectionRange = aceSelection.getRange();
        console.log(this.currentSelectionRange);
        console.log(this.editorRef.current.editor.getSelectedText());
    }

    /**
     * React lifecycle method. Hooks up the _onTimeout method to be called every props#timerIntervalMSec seconds.
     */
    componentDidMount() {
        this.setState({timerId: setInterval(this._onTimeout, this.props.timerIntervalMSec)})
    }

    /**
     * Render the AnnotationEditor component.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <React.Fragment>
                <AnnotationPicker textSelected={this.state.textSelected}
                                  annotations = {[{a_id: 1, name: "hello"}, {a_id:2, name:"bibi", color:"#fffff"}]}
                                  onPicked={this._onPicked}/>
                <AceEditor
                ref={this.editorRef}
                mode="text"
                theme="github"
                height="100%"
                width="100%"
                fontSize={18}
                name="annotationEditor"
                wrapEnabled={true}
                className="editor"
                value={testvalue}
                onLoad={this._onLoad}
                onSelectionChange={this._onSelection}
                setOptions={
                    {
                        readOnly : true
                    }
                }
                markers={this.state.markers}
                // markers={[{startRow: 1, startColumn:10,endRow:2, endColumn:14, className: "ace_marker-temp"}]}
                editorProps={{ $blockScrolling: true }}
            />
            </React.Fragment>
        );
    }


}

AnnotationEditor.propTypes = {
    timerIntervalMSec: PropTypes.number,
    autoSave: PropTypes.bool,
    onSave: PropTypes.func,
    annotations: PropTypes.any
};

export default AnnotationEditor;
