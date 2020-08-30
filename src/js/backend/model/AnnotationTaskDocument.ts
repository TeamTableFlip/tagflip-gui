import {
    AnnotationTaskAttributes,
    AnnotationTaskDocumentAttributes,
    DocumentAnnotationState, DocumentAttributes
} from "@fhswf/tagflip-common";

export default class AnnotationTaskDocument implements AnnotationTaskDocumentAttributes {

    private _attributes: AnnotationTaskDocumentAttributes

    private constructor() {
        this._attributes = {
            annotationTaskId: 0,
            annotationTaskDocumentId: 0,
            documentId: 0,
            state: DocumentAnnotationState.open,
            document: undefined,
            createdAt: undefined,
            updatedAt: undefined
        }
    }

    public static create = (attributes?: AnnotationTaskDocumentAttributes): AnnotationTaskDocument => {
        let annotationTask = new AnnotationTaskDocument();
        if (attributes) {
            for (let key of Object.keys(attributes)) {
                annotationTask[key] = attributes[key];
            }
        }

        return annotationTask;
    }


    get annotationTaskDocumentId(): number {
        return this._attributes.annotationTaskDocumentId;
    }

    set annotationTaskDocumentId(value: number) {
        this._attributes.annotationTaskDocumentId = value;
    }

    get annotationTaskId(): number {
        return this._attributes.annotationTaskId;
    }

    set annotationTaskId(value: number) {
        this._attributes.annotationTaskId = value;
    }

    get documentId(): number {
        return this._attributes.documentId;
    }

    set documentId(value: number) {
        this._attributes.documentId = value;
    }

    get state(): DocumentAnnotationState {
        return this._attributes.state;
    }

    set state(value: DocumentAnnotationState) {
        this._attributes.state = value;
    }

    get createdAt(): Date {
        return this._attributes.createdAt;
    }

    set createdAt(value: Date) {
        this._attributes.createdAt = value;
    }

    get updatedAt(): Date {
        return this._attributes.updatedAt;
    }

    set updatedAt(value: Date) {
        this._attributes.updatedAt = value;
    }

    get document(): DocumentAttributes {
        return this._attributes.document;
    }

    set document(value : DocumentAttributes) {
        this._attributes.document = value;
    }

    public toJSON() {
        return {...this._attributes}
    }


}
