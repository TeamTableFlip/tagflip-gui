import React, { Component } from "react";
import ReactDom from "react-dom";

import { EditorView, Decoration } from "@codemirror/next/view"
import { DecorationSet, RangeSet } from "@codemirror/next/rangeset"
import { EditorState } from "@codemirror/next/state"
import { Range } from "@codemirror/next/rangeset"

import PropTypes from "prop-types";
import AnnotationPicker from "./dialogs/AnnotationPicker";
import "./AnnotationEditorCodeMirror.scss"
import "./temp-maker.css"
import AnnotationHighlight from "./AnnotationHighlight";

const initialState = {
    textSelected: false,
};

/**
 * A React Component for displaying the CodeMirror Web-Editor in React, with the extension of annotating text within it.
 */
class AnnotationEditorCodeMirror extends Component {
    /**
     * Create a new AnnotationEditorCodeMirror component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.state = initialState;
        this._onAnnotationPicked = this._onAnnotationPicked.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);

        this.editorRefCallback = element => {
            if (!this.editorRef) {
                this.editorRef = element;
                element.codeMirror.getWrapperElement().addEventListener("mouseup", this._onMouseUp);
                this.forceUpdate();
            }
        };
        this.activeMarkers = new Map();
    }

    /**
     * React lifecycle method. Unmounts all currently active markers to hide them.
     */
    componentWillUnmount() {
        // unmounting custom mount components
        for (let [t_id, marker] of this.activeMarkers.entries()) {
            ReactDom.unmountComponentAtNode(marker.container);
        }
    }

    /**
     * React lifecycle method. Determines which Tags shall be rendered, due to adding/removing Tags in the document.
     * @param prevProps The properties of this component before updating.
     * @param prevState The state of this component before updating.
     * @param snapshot The snapshot of the component before the update occurred.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        let deletedTags = new Set();
        let newTags = new Set();

        if (prevProps.tags.length < this.props.tags.length) {
            let prevTags = new Set(prevProps.tags.map(t => t.t_id));
            let currentTags = new Set(this.props.tags.map(t => t.t_id));

            newTags = new Set([...currentTags].filter(x => !prevTags.has(x)))
        } else if (prevProps.tags.length > this.props.tags.length) {
            let prevTags = new Set(prevProps.tags.map(t => t.t_id));
            let currentTags = new Set(this.props.tags.map(t => t.t_id));

            deletedTags = new Set([...prevTags].filter(x => !currentTags.has(x)))
        } else {
            let prevTags = new Set(prevProps.tags.map(t => t.t_id));
            let currentTags = new Set(this.props.tags.map(t => t.t_id));
            // console.log("prev: ", prevTags, "current:", currentTags)
            newTags = new Set([...currentTags].filter(x => !prevTags.has(x)));
            deletedTags = new Set([...prevTags].filter(x => !currentTags.has(x)));
        }

        newTags = this.props.tags.filter(x => newTags.has(x.t_id));
        deletedTags = prevProps.tags.filter(x => deletedTags.has(x.t_id));
        console.log("New: ", newTags, "Deleted:", deletedTags);

        this._renderTags(newTags, deletedTags);
    }

    /**
     * Handle CodeMirror's mouse up event, which is used for selecting text.
     * @private
     */
    _onMouseUp() {
        let codeMirror = this.editorRef.codeMirror;
        // console.log("_onMouseUp");
        if (codeMirror.somethingSelected()) {

            let selections = codeMirror.listSelections();
            if (selections.length === 1) {
                this.setState({
                    textSelected: true,
                    selectionFromIndex: codeMirror.indexFromPos(selections[0].anchor),
                    selectionToIndex: codeMirror.indexFromPos(selections[0].head)
                });
            }
        }
    }

    /**
     * Handle the deletion of a selected Tag. Is called by AnnotationHighlight#onDelete.
     * @param tag The Tag to be deleted.
     * @private
     */
    _onDelete(tag) {
        this.props.onDeleteTag(tag);
    }

    /**
     * Handle the picking/selection of an Annotation for a selected text from CodeMirror.
     * @param annotation The picked Annotation to be assigned to the selected text.
     * @private
     */
    _onAnnotationPicked(annotation) { //annotation  has .a_id .color .name .s_id
        let codeMirror = this.editorRef.codeMirror;

        let startIndex = this.state.selectionFromIndex;
        let endIndex = this.state.selectionToIndex;

        if (endIndex < startIndex) {
            let helpIndex = startIndex;
            startIndex = endIndex;
            endIndex = helpIndex;
        }

        let newTag = {
            start_index: startIndex,
            end_index: endIndex,
            a_id: annotation.a_id,
            d_id: this.props.document.d_id
        };

        this.props.onSaveTag(newTag);
        this.setState({ textSelected: false });
    }

    /**
     * Handle the Abort-Action of picking an Annotation.
     * @private
     */
    _cancelSelection() {
        let codeMirror = this.editorRef.codeMirror;
        codeMirror.setCursor(0, 0);
        this.setState({ textSelected: "" })
    }

    /**
     * Render all Tags of the current document.
     * @param newTags The new added Tags to be added for rendering.
     * @param deletedTags The deleted Tags to be ignored for rendering.
     * @private
     */
    _renderTags(newTags, deletedTags = new Set()) {
        if (!this.editorRef)
            return;

        if (newTags && newTags.length > 0) {

            let mark = Decoration.mark({
                attributes: { style: 'background-color: rgba(20, 100, 200, 0.5)' },
                tagName: 'span'
            })

            let decorations = []
            for (let tag of newTags) {
                let annotation = undefined;
                for (let a of this.props.annotations) {
                    if (a.a_id === tag.a_id) {
                        annotation = a;
                    }
                }
                if (!annotation) {
                    return;
                }

                if (tag.start_index < tag.end_index) {
                    const decoration = mark.range(tag.start_index, tag.end_index);
                    decorations.push(decoration);
                    this.editorRef.docView.decorations.push(decoration);
                }

            }
            console.log('view: %o', this.editorRef.docView.decorations)
            console.log('decorations: %o', decorations);

            // let decorationSet = RangeSet.of(decorations, true);
            // console.log('decoSet: %o', decorationSet);
            console.log('view: %o', this.editorRef)
        }

        /*
        let codeMirror = this.editorRef.codeMirror;

        if (deletedTags && deletedTags.length > 0) {
            for (let tag of deletedTags) {
                let marker = this.activeMarkers.get(tag.t_id);
                ReactDom.unmountComponentAtNode(marker.container);
                marker.marker.clear();
                this.activeMarkers.delete(tag.t_id);
            }
        }

        if (newTags && newTags.length > 0) {

            for (let tag of newTags) {
                let anchor = codeMirror.posFromIndex(tag.start_index);
                let head = codeMirror.posFromIndex(tag.end_index);

                let annotation = undefined;
                for (let a of this.props.annotations) {
                    if (a.a_id === tag.a_id) {
                        annotation = a;
                    }
                }
                if (!annotation) {
                    return;
                }

                let replacementContainer = document.createElement('span'); // this has to be here to handle click events ...
                let textMarker = codeMirror.markText(anchor, head, {
                    replacedWith: replacementContainer,
                    handleMouseEvents: true
                });
                codeMirror.setSelection(anchor, head);
                let text = codeMirror.getSelection();
                codeMirror.setCursor(0, 0);
                codeMirror.setSelection(codeMirror.posFromIndex(0), codeMirror.posFromIndex(0));

                this.activeMarkers.set(tag.t_id, {
                    marker: textMarker,
                    container: replacementContainer,
                    text: text
                });

                let reactElement = (
                    <AnnotationHighlight id={`hightlight-${tag.t_id}`}
                        tag={tag}
                        annotation={annotation}
                        text={text}
                        onDelete={() => this._onDelete(tag)}
                    />);
                ReactDom.render(reactElement, replacementContainer);
            }
            */
    }


    /**
     * React lifecycle method. Renders all Tags of the component when loaded.
     */
    componentDidMount() {
        const state = EditorState.create({
            doc: this.props.document && this.props.document.text || "",
            //extensions: [keymap(baseKeymap)]
        })

        this.editorState = state;
        this.editorRef = new EditorView({ state });
        this.componentRef.appendChild(this.editorRef.dom);
        this._renderTags(this.props.tags);
    }

    /**
     * Render the AnnotationEditorCodeMirror component.
     * @returns {*} The component to be rendered.
     */
    render() {

        return (
            <React.Fragment>
                <div ref={(DOMNodeRef) => { this.componentRef = DOMNodeRef; }}>
                </div>
            </React.Fragment>
        );
    }

}

AnnotationEditorCodeMirror.propTypes = {
    annotations: PropTypes.array,       // The list of all available Annotations to be used for tagging.
    document: PropTypes.object,         // The Document to be displayed in the Editor.
    tags: PropTypes.array,              // The list of the existing Tags to be rendered.
    onSaveTag: PropTypes.func,          // Is called when a new Annotation is being picked
    //  - 1 param: newTag (The Tag to be saved)
    onDeleteTag: PropTypes.func         // Is called when an existing Tag will be deleted
    //  - 1 param: tag (The Tag to be deleted)
};

export default AnnotationEditorCodeMirror;
