import {AnnotationAttributes, TagAttributes} from "@fhswf/tagflip-common";
import {
    Decoration,
    DecorationSet,
    EditorView,
    PluginField,
    PluginValue,
    ViewUpdate,
    WidgetType
} from "@codemirror/next/view";
import AnnotationHighlight from "./AnnotationHighlight";
import ReactDom from "react-dom";
import React, {DOMElement, ReactElement} from "react";
import {StateEffect} from "@codemirror/next/state";
import * as ld from "lodash"
import chroma from "chroma-js";


export interface PluginAttributes {
    plugin: TagPluginValue,
    onSaveCallback: (_: TagAttributes) => any,
    onDeleteCallback: (_: TagAttributes) => any
}

/**
 * Represents a tag change, i.e. tags being added and/or deleted.
 */
export class TagChange {
    newTags: TagAttributes[]
    deletedTags: TagAttributes[]

    constructor(newTags: TagAttributes[], deleteTags: TagAttributes[] = []) {
        this.newTags = newTags
        this.deletedTags = deleteTags
    }
}

/**
 * Represents a annotation set change
 */
export class AnnotationChange {
    annotations: AnnotationAttributes[]

    constructor(annotations: AnnotationAttributes[]) {
        this.annotations = annotations
    }
}

/**
 * Plugin for displaying tag annotations.
 */
export class TagPluginValue implements PluginValue {
    decorations: DecorationSet;
    tags: TagAttributes[];
    annoDict: {};
    currentWidgets : TagWidget[]

    static pluginField = PluginField.define<PluginAttributes>()
    static changeAnnotationsEffect = StateEffect.define<AnnotationChange>()
    static changeTagsEffect = StateEffect.define<TagChange>()

    constructor(view: EditorView) {
        console.log('TagPluginValue:ctor')
        this.decorations = Decoration.none
        this.tags = [];
        this.annoDict = {}
        this.currentWidgets = []
        this.update = this.update.bind(this);
    }

    /**
     * Handle an update.
     * Updates can be either transactions changing the plugin state or updates to the document, selection or viewport.
     * @param update ViewUpdate
     */
    update(update: ViewUpdate) {
        if (update) {

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
                                this.tags.push(... tagChange.newTags)
                                this.tags = ld.differenceBy(this.tags, tagChange.deletedTags, "tagId")

                                this.decorations = this.createDecorations(update.view)
                            }

                            if (e.value instanceof AnnotationChange) {
                                this.annoDict = {}
                                for (let a of e.value.annotations) {
                                    this.annoDict[a.annotationId] = {
                                        annotation: a,
                                        mark: Decoration.mark({
                                            tagName: "span",
                                            class: a.name,
                                            attributes: {style: `background-color: ${a.color}; color: ${chroma(a.color).luminance() < 0.35 ? '#fff' : '#000'}`}
                                        })
                                    }
                                }
                                this.decorations = this.createDecorations(update.view)
                            }

                        })
                    }
                });
            } else {
                // Redraw if document or viewport has changed
                if (update.viewportChanged || update.heightChanged || update.docChanged) {
                    this.decorations = this.createDecorations(update.view)
                }
            }
        }
    }

    destroy() {
        this.currentWidgets.forEach(w => w.destroy());
    }

    /**
     * Create Decorations for tags in the visible region.
     * @param view
     */
    createDecorations(view: EditorView): DecorationSet {
        let deco = []
        this.currentWidgets.forEach(w => w.destroy());
        this.currentWidgets = []
        if (this.annoDict) {
            for (let part of view.visibleRanges) {
                [...this.tags].filter(tag => tag.startIndex <= part.to && tag.endIndex >= part.from)
                    .sort((a, b) => a.startIndex - b.endIndex)
                    .forEach(tag => {
                        if (this.annoDict[tag.annotationId]) {
                            const text = view.state.sliceDoc(tag.startIndex, tag.endIndex)
                            const tagWidget = new TagWidget({
                                label: this.annoDict[tag.annotationId].annotation.name,
                                text: text,
                                tag: tag,
                                onDeleteCallback: view.pluginField(TagPluginValue.pluginField)[0].onDeleteCallback
                            })
                            this.currentWidgets.push(tagWidget)
                            deco.push(this.annoDict[tag.annotationId].mark.range(tag.startIndex, tag.endIndex))
                            deco.push(Decoration.widget({
                                widget: tagWidget,
                                side: 0
                            }).range(tag.startIndex))
                        }
                    })
            }
        }
        return Decoration.set(deco, true)
    }
}


class TagDecoration {
    label: string
    text: string
    tag: TagAttributes
    onDeleteCallback: (_: TagAttributes) => any
}

class TagWidget extends WidgetType<TagDecoration> {
    decoration: TagDecoration
    element: HTMLElement
    reactElement: ReactElement

    constructor(decoration: TagDecoration) {
        super(decoration);
        this.decoration = decoration
    }

    destroy() {
        ReactDom.unmountComponentAtNode(this.element) // unmount manually rendered react elements
    }

    toDOM(view: EditorView): HTMLElement {
        this.element = document.createElement("span")
        let tag = this.decoration.tag

        let annotation = {
            name: this.decoration.label,
            color: 'rgba(10, 40, 100, 0.6)'
        }

        this.reactElement = (
            <>
                <AnnotationHighlight id={`hightlight-${tag.tagId}`}
                                     tag={tag}
                                     annotation={annotation}
                                     text={this.decoration.text}
                                     onDelete={() => this.onDelete(tag)}
                />
            </>
        );

        ReactDom.render(this.reactElement, this.element);
        return this.element;
    }

    onDelete(tag: TagAttributes) {
        console.log('onDelete: %o', tag)
        this.decoration.onDeleteCallback(tag)
    }
}
