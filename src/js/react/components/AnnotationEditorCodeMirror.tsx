import React, { Component } from "react";
import ReactDom from "react-dom";

import {
    Decoration,
    DecorationSet,
    EditorView,
    PluginField,
    PluginValue,
    ViewPlugin,
    ViewUpdate,
    WidgetType
} from "@codemirror/next/view"
import { EditorState, StateEffect, StateField } from "@codemirror/next/state"

import PropTypes from "prop-types";
import AnnotationPicker from "./dialogs/AnnotationPicker";
import "./AnnotationEditorCodeMirror.scss"
import "./temp-maker.css"
import AnnotationHighlight from "./AnnotationHighlight";
import { AnnotationAttributes, TagAttributes } from "@fhswf/tagflip-common";
import Tag from "../../backend/model/Tag";


class State {
    textSelected: String
    selectionFromIndex: number
    selectionToIndex: number
}

const initialState = {
    textSelected: "",
    selectionFromIndex: -1,
    selectionToIndex: -1
};

class TagDecoration {
    label: string
    text: string
    tag: TagAttributes
    props: AnnotationProps
    //start: number
    //end: number
}

class TagWidget extends WidgetType<TagDecoration> {
    decoration: TagDecoration

    constructor(decoration: TagDecoration) {
        super(decoration);
        this.decoration = decoration
    }

    toDOM(view: EditorView): HTMLElement {
        let element = document.createElement("span")
        let tag = this.decoration.tag

        let annotation = {
            name: this.decoration.label,
            color: 'rgba(10, 40, 100, 0.6)'
        }

        let reactElement = (
            <React.Fragment>
                <AnnotationHighlight id={`hightlight-${tag.tagId}`}
                    tag={tag}
                    annotation={annotation}
                    text={this.decoration.text}
                    onDelete={() => this.onDelete(tag)}
                />
            </React.Fragment>
        );

        ReactDom.render(reactElement, element);
        return element;
    }

    onDelete(tag: TagAttributes) {
        console.log('onDelete: %o', tag)
        this.decoration.props.onDeleteTag(tag)
    }
}

class AnnotationProps {
    annotations: AnnotationAttributes[]; // The list of all available Annotations to be used for tagging.
    document: any; // The Document to be displayed in the Editor.
    tags: TagAttributes[]; // The list of the existing Tags to be rendered.
    onSaveTag: (...args: any[]) => any; // Is called when a new Annotation is being picked
    //  - 1 param: newTag (The Tag to be saved)
    onDeleteTag: (...args: any[]) => any; // Is called when an existing Tag will be deleted
}

/**
 * Represents a tag change, i.e. tags being added and/or deleted.
 */
class TagChange {
    addedTags: TagAttributes[]
    deletedTags: TagAttributes[]

    constructor(addedTags: TagAttributes[], deletedTags: TagAttributes[] = []) {
        this.addedTags = addedTags
        this.deletedTags = deletedTags
    }
}

const pluginField = PluginField.define<{
    plugin: TagPluginValue,
    props: AnnotationProps,
    parent: AnnotationEditorCodeMirror
}>()

/**
 * Plugin for displaying tag annotations.
 */
class TagPluginValue implements PluginValue {
    decorations: DecorationSet;
    tags: Set<TagAttributes> = new Set()
    visibleTags: Set<TagAttributes> = new Set()
    tagsState: StateField<TagAttributes[]>;
    tagWidget: TagWidget;
    annoDict: {};
    pluginField: readonly { plugin: TagPluginValue; props: AnnotationProps; parent: AnnotationEditorCodeMirror }[];

    constructor(view: EditorView) {
        console.log('TagPluginValue:ctor')
        this.decorations = Decoration.none
    }

    /**
     * Handle an update.
     * Updates can be either transactions changing the plugin state or updates to the document, selection or viewport.
     * @param update ViewUpdate
     */
    update(update: ViewUpdate) {

        if (!this.annoDict) {
            this.pluginField = update.view.pluginField(pluginField)

            this.annoDict = {}
            if (this.pluginField && this.pluginField.length > 0) {
                this.pluginField[0].props.annotations.forEach(a => {
                    this.annoDict[a.annotationId] = {
                        annotation: a,
                        mark: Decoration.mark({
                            tagName: "span",
                            class: a.name,
                            attributes: { style: `background-color: ${a.color}` }
                        })
                    }
                })
                console.log('getDeco: annos: %o', this.annoDict)
            }
        }

        if (update) {
            //console.log('tagHighlighter.update: %o', update);
            if (update.viewportChanged) {
                console.log('new viewport: %o', update.view.viewport)
            }
            if (update.transactions.length > 0) {
                update.transactions.forEach(t => {
                    console.log('transaction: %o', t)
                    if (t.effects) {
                        t.effects.forEach(e => {
                            console.log('effect: %o', e)

                            if (e.value instanceof TagChange) {
                                console.log('typeof e: %s', typeof e)
                                let tagChange: TagChange = e.value
                                tagChange.addedTags.forEach(tag => this.tags.add(tag))
                                tagChange.deletedTags.forEach(tag => this.tags.delete(tag))

                                this.decorations = this.createDecorations(update.view)
                            }
                        })
                    }
                });
            }
            else {
                // Redraw if document or viewport has changed
                if (update.viewportChanged || update.heightChanged || update.docChanged) {
                    this.decorations = this.createDecorations(update.view)
                }
            }
        }
    }

    /**
     * Create Decorations for tags in the visible region.
     * @param view 
     */
    createDecorations(view: EditorView): DecorationSet {
        let deco = []
        for (let part of view.visibleRanges) {
            [...this.tags].filter(tag => tag.startIndex <= part.to && tag.endIndex >= part.from)
                .sort((a, b) => a.startIndex - b.endIndex)
                .forEach(tag => {
                    const text = view.state.sliceDoc(tag.startIndex, tag.endIndex)
                    deco.push(this.annoDict[tag.annotationId].mark.range(tag.startIndex, tag.endIndex))
                    deco.push(Decoration.widget({
                        widget: new TagWidget({ label: this.annoDict[tag.annotationId].annotation.name, text: text, tag: tag, props: this.pluginField[0].props }),
                        side: 0
                    }).range(tag.startIndex))
                })
        }
        return Decoration.set(deco, true)
    }
}

/**
 * A React Component for displaying the CodeMirror Web-Editor in React, with the extension of annotating text within it.
 */
class AnnotationEditorCodeMirror extends Component<AnnotationProps, State> {
    [x: string]: any;
    editorRefCallback: (element: any) => void;
    editorRef: EditorView;
    editorState: EditorState;
    selectionState: State;
    state: State;
    componentRef: any;

    static propTypes: {
        annotations: PropTypes.Requireable<AnnotationAttributes[]>; // The list of all available Annotations to be used for tagging.
        document: PropTypes.Requireable<object>; // The Document to be displayed in the Editor.
        tags: PropTypes.Requireable<any[]>; // The list of the existing Tags to be rendered.
        onSaveTag: PropTypes.Requireable<(...args: any[]) => any>; // Is called when a new Annotation is being picked
        //  - 1 param: newTag (The Tag to be saved)
        onDeleteTag: PropTypes.Requireable<any>; // Is called when an existing Tag will be deleted
    };

    // static changeTags: StateEffectType<TagChange>;

    /**
    * Create a new AnnotationEditorCodeMirror component.
    * @param props The properties of the component.
    */
    constructor(props: AnnotationProps) {
        super(props);
        this.state = initialState;

        this.onAnnotationPicked = this.onAnnotationPicked.bind(this);

        this.tagHighlighter = ViewPlugin.fromClass(TagPluginValue)
            .provide(pluginField, (value: TagPluginValue) => ({ plugin: value, props: this.props, parent: this }))
            .decorations()

        this.changeTags = StateEffect.define<TagChange>()

        this.editorRefCallback = element => {
            if (!this.editorRef) {
                this.editorRef = element;
                this.forceUpdate();
            }
        };
    }

    /**
     * React lifecycle method. Initializes EditorView and renders all Tags of the component when loaded.
     */
    componentDidMount() {

        const state = EditorState.create({
            doc: this.props.document && this.props.document.content || "",
            extensions: [
                this.tagHighlighter,
                EditorView.lineWrapping,
                EditorView.editable.of(false),
                EditorView.exceptionSink.of((exception) => console.log('exceptionSink: %o', exception)),
                EditorView.domEventHandlers({
                    mouseup: (event, view) => {
                        console.log('mouseup: %o %o', event, view)

                        let selectionState = this.createSelectionState(view)
                        this.setSelectionState(selectionState)
                        console.log('selectionState: %o', selectionState)

                        return false;
                    }
                })
            ]
        })


        // this.editorState = state;
        this.editorRef = new EditorView({ state });
        this.componentRef.appendChild(this.editorRef.dom);
        console.log('highlighter: %o', this.tagHighlighter);



        let tagChange = new TagChange(this.props.tags);
        this.dispatch(tagChange)
    }

    /**
     * React lifecycle method. Unmounts all currently active markers to hide them.
     */
    componentWillUnmount() {

    }

    /**
     * React lifecycle method. Determines which Tags shall be rendered, due to adding/removing Tags in the document.
     * @param prevProps The properties of this component before updating.
     * @param prevState The state of this component before updating.
     * @param snapshot The snapshot of the component before the update occurred.
     */
    componentDidUpdate(prevProps: AnnotationProps, prevState, snapshot) {
        let deletedIDs = new Set<number>();
        let newIDs = new Set<number>();

        if (prevProps.tags.length < this.props.tags.length) {
            let prevTags = new Set(prevProps.tags.map(t => t.tagId));
            let currentTags = new Set(this.props.tags.map(t => t.tagId));

            newIDs = new Set([...currentTags].filter(x => !prevTags.has(x)))
        } else if (prevProps.tags.length > this.props.tags.length) {
            let prevTags = new Set(prevProps.tags.map(t => t.tagId));
            let currentTags = new Set(this.props.tags.map(t => t.tagId));

            deletedIDs = new Set([...prevTags].filter(x => !currentTags.has(x)))
        } else {
            let prevTags = new Set(prevProps.tags.map(t => t.tagId));
            let currentTags = new Set(this.props.tags.map(t => t.tagId));
            // console.log("prev: ", prevTags, "current:", currentTags)
            newIDs = new Set([...currentTags].filter(x => !prevTags.has(x)));
            deletedIDs = new Set([...prevTags].filter(x => !currentTags.has(x)));
        }

        let newTags = this.props.tags.filter(x => newIDs.has(x.tagId));
        let deletedTags = prevProps.tags.filter(x => deletedIDs.has(x.tagId));
        console.log("New: ", newIDs, "Deleted:", deletedIDs);

        let tagChange = new TagChange(newTags, deletedTags);
        this.dispatch(tagChange)
    }


    /**
     * Dispatch a tag change to our view plugin.
     * @param tagChange 
     */
    dispatch(tagChange: TagChange) {
        console.log('dispatch: %o', tagChange)
        if (tagChange.addedTags.length > 0 || tagChange.deletedTags.length > 0) {
            let tagUpdate = this.changeTags.of(tagChange);
            let state = this.editorRef.state;
            let transaction = state.update({ effects: tagUpdate });
            console.log('transaction: %o', transaction)
            this.editorRef.dispatch(transaction);
        }
        else {
            console.log('not dispatching TagChange without content')
        }
        console.log('after dispatch');
    }

    /**
     * Handle the deletion of a selected Tag. Is called by AnnotationHighlight#onDelete.
     * @param tag The Tag to be deleted.
     * @private
     */
    onDelete(tag) {
        this.props.onDeleteTag(tag);

        let tagChange = new TagChange([], [tag])
        //this.dispatch(tagChange)
    }

    /**
     * Handle the picking/selection of an Annotation for a selected text from CodeMirror.
     * @param annotation The picked Annotation to be assigned to the selected text.
     * @private
     */
    onAnnotationPicked(annotation) { //annotation  has .a_id .color .name .s_id
        let codeMirror = this.editorRef;

        let startIndex = this.state.selectionFromIndex;
        let endIndex = this.state.selectionToIndex;

        if (endIndex < startIndex) {
            let helpIndex = startIndex;
            startIndex = endIndex;
            endIndex = helpIndex;
        }

        let newTag: Tag = Tag.create({
            startIndex: startIndex,
            endIndex: endIndex,
            annotationId: annotation.annotationId,
            documentId: this.props.document.documentId
        });

        this.props.onSaveTag(newTag);
        this.state.textSelected = "";
        this.setState(this.state);
    }

    /**
     * Handle the Abort-Action of picking an Annotation.
     * @private
     */
    _cancelSelection() {
        let codeMirror = this.editorRef;
        //codeMirror.setCursor(0, 0);
        this.state.textSelected = "";
        this.setState(this.state);
    }



    setSelectionState(selectionState: State) {
        this.state = selectionState
        this.setState(this.state)
        console.log('setSelectionState: %o', this.state)
    }

    createSelectionState(view: EditorView): State {
        let selection = view.state.selection
        let selectionState: State = {
            selectionFromIndex: selection.primary.from,
            selectionToIndex: selection.primary.to,
            textSelected: view.state.sliceDoc(selection.primary.from, selection.primary.to)
        }
        return selectionState
    }


    /**
     * Render the AnnotationEditorCodeMirror component.
     * @returns {*} The component to be rendered.
     */
    render() {

        return (
            <React.Fragment>
                <AnnotationPicker show={this.state.textSelected.length > 0}
                    annotations={this.props.annotations}
                    onPicked={this.onAnnotationPicked}
                    onCanceled={() => this._cancelSelection()}
                />
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
