import React, {FunctionComponent, useEffect, useRef, useState} from "react";
import ReactDOM from 'react-dom'
import AnnotationPicker from "../../components/Dialog/AnnotationPicker";
import {AnnotationAttributes, DocumentAttributes, TagAttributes} from "@fhswf/tagflip-common";
import {EditorView, ViewPlugin} from "@codemirror/next/view";
import {EditorSelection, EditorState} from "@codemirror/next/state";
import {usePrevious} from "../../../hooks";
import {AnnotationChange, TagChange, TagPluginValue} from "./CodeMirrorTagPlugin";
import Tag from "../../../backend/model/Tag";
import * as ld from "lodash"

interface Props {
    tags: TagAttributes[],
    annotations: AnnotationAttributes[],
    document: DocumentAttributes,
    onSaveTag?: (_: TagAttributes) => any
    onDeleteTag?: (_: TagAttributes) => any
}

interface SelectionState {
    selectionFromIndex: number,
    selectionToIndex: number,
    textSelected: string
}


const AnnotationEditorCodeMirror: FunctionComponent<Props> = (props) => {
    const editorInitialState = EditorState.create({
        doc: props.document && props.document.content || "",
        extensions: [
            ViewPlugin.fromClass(TagPluginValue)
                .provide(TagPluginValue.pluginField, (value: TagPluginValue) => ({
                    plugin: value,
                    onSaveCallback: props.onSaveTag,
                    onDeleteCallback: props.onDeleteTag || undefined
                }))
                .decorations(),
            EditorView.lineWrapping,
            EditorView.editable.of(false),
            EditorView.exceptionSink.of((exception) => console.log('exceptionSink: %o', exception)),
            EditorView.domEventHandlers({
                mouseup: (event, view) => {
                    console.log('mouseup: %o %o', event, view)
                    let selection = view.state.selection
                    let selectionState: SelectionState = {
                        selectionFromIndex: selection.primary.from,
                        selectionToIndex: selection.primary.to,
                        textSelected: view.state.sliceDoc(selection.primary.from, selection.primary.to)
                    }
                    setSelectionState(selectionState)
                    console.log('selectionState: %o', selectionState)
                    return false;
                }
            })
        ]
    })

    const componentRef = useRef(null);
    const [selectionState, setSelectionState] = useState<SelectionState>(null)
    const [editorRef, _] = useState<EditorView>(new EditorView({state: editorInitialState}))

    // componentDidMount
    useEffect(() => {
        ReactDOM.findDOMNode(componentRef.current).appendChild(editorRef.dom)
    }, [])

    // componentWillUnmount
    useEffect(() => {
        // return function that will be called on unmount
        return function cleanup() {
            if (editorRef) {
                editorRef.destroy()
                let parent = ReactDOM.findDOMNode(componentRef.current)
                if (parent.contains(editorRef.dom)) {
                    ReactDOM.findDOMNode(componentRef.current).removeChild(editorRef.dom)
                }
            }
        }
    }, [])

    // on change props.tags
    let previousTags = usePrevious(props.tags)
    useEffect(() => {
        if (!previousTags)
            previousTags = []
        let currentTags = props.tags ? props.tags : []

        let prevTagIds = previousTags.map(t => t.tagId);
        let currentTagIds = currentTags.map(t => t.tagId);

        let newTagIds = ld.difference(currentTagIds, prevTagIds)
        let removedTagIds = ld.difference(prevTagIds, currentTagIds)

        let newTags = currentTags.filter(x => ld.includes(newTagIds, x.tagId));
        let deletedTags = previousTags.filter(x => ld.includes(removedTagIds, x.tagId));
        console.log("New: ", newTags, "Deleted:", deletedTags);

        editorRef.dispatch(editorRef.state.update({effects: TagPluginValue.changeTagsEffect.of(new TagChange(newTags, deletedTags))}))
    }, [props.tags])

    useEffect(() => {
        editorRef.dispatch(editorRef.state.update({effects: TagPluginValue.changeAnnotationsEffect.of(new AnnotationChange(props.annotations))}))
    }, [props.annotations])

    // on change props.document
    useEffect(() => {
        if (props.document) {
            editorRef.dispatch(editorRef.state.update({ changes: { from: 0, to: editorRef.state.doc.length, insert: props.document.content }}))
        }
    }, [props.document])

    // on change selectionState
    useEffect(() => {
        //remove selection in editor if not available
        if (!selectionState) {
            editorRef.dispatch({selection: editorRef.state.selection.replaceRange(EditorSelection.range(0, 0))})
        }
    }, [selectionState])

    const onAnnotationPicked = (annotation: AnnotationAttributes) => {
        let startIndex = selectionState.selectionFromIndex;
        let endIndex = selectionState.selectionToIndex;

        if (endIndex < startIndex) {
            let helpIndex = startIndex;
            startIndex = endIndex;
            endIndex = helpIndex;
        }

        let newTag: Tag = Tag.create({
            startIndex: startIndex,
            endIndex: endIndex,
            annotationTaskId: undefined,
            annotationId: annotation.annotationId,
            documentId: props.document.documentId
        });

        props.onSaveTag(newTag);
        setSelectionState(undefined)
    }

    return (
        <>
            {props.onSaveTag && <AnnotationPicker show={selectionState && selectionState.textSelected.length > 0}
                                                  annotations={props.annotations}
                                                  onPicked={onAnnotationPicked}
                                                  onCanceled={() => setSelectionState(undefined)}
            />}
            <div className="CodeMirror" ref={componentRef}/>
        </>
    )
}


export default AnnotationEditorCodeMirror;